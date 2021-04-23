import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import Link from 'next/link';
import Image from 'next/image';

//Definindo a tipagem 
type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
  }
  
  type EpisodeProps = {
    episode: Episode;
  }

export default function Episode({ episode }: EpisodeProps){
    const router = useRouter();

    //isFallback = boolean (true or false) -> Se está em carregamento, da o return com a mensagem "Carregando..."
    //Como está usando o fallback: 'blocking' não precisa desta validação
    // if(router.isFallback){
    //     return <p>Carregando...</p>
    // }

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>

                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover" 
                />
                <button type="button">
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            {/* Para não correr risco de injeção de código, chama "dangerouslySetInnerHTML" na div e convert em texto o HTML que é retornado no description */}
            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description }} 
            />
        </div>
    )
}

//Obrigatório usar este método em toda página que usar geração estática e também em toda página que recebe parâmetro dinâmino no nome
//ex.: [slug]
//Principal momento que gera página estática da aplicação é no momento da build.
//Se passar o paths:[] vazio, o next entende que não vai gerar de forma estática nenhum episodio da build
//Cada episodio que deseja gerar de forma estática, deve ser enviado um objeto como params dentro do paths (pode receber mais de 1 parâmetro)
//Definições fallback -> false    = se acessar episodio e não foi gerado pag estática não vai encontrar e vai retornar 404
//                       true     = (Requisição acontece lado do client/browser) se acessar episodio e não foi gerado pag estática, o true faz com que 
//                                  tente buscar o episodio para gerar a pág. 
//                                  * Como não tem nada, isso pode demorar um pouco e dar erro no retorno por ainda não ter os dados carregados.
//                                  * Para resolver faça import do hook useRouter
//                       blocking = Ao clicar no link, só sera navegada para tela quando os dados tiverem sido carregados - Para SEO é a melhor opção, pois assim
//                                  algum dado que depende de indexação já estará carregado.
//                                  * 

//conceito de fallback(true or blocking) -> Incremental static regeneration -> Permite gerar novas páginas conforme vão acessando e re-validar/re-gerar 
//                                          páginas obsoletas (com prazo de validade vencido -> "revalidate")
export const getStaticPaths: GetStaticPaths = async() => {

    //faz uma chamada na API buscando os dois últimos episódios.
    const { data } = await api.get('episodes', {
        params:{
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
    })

    //Retorna params (id) para slug
    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    //passa a const paths com o retorno dos episódios e ai vai gerar as páginas estáticas baseada nesse retorno.
    return {
        paths,
        fallback:'blocking'
    }
}

//SSG
//Recebe um contexto -> (ctx) para conseguir pegar e definir o nome de cada página dinamicamente. -> slug
//o mesmo nome do arquivo [slug] deve ser o que vai receber o ctx e passar no api.get
export const getStaticProps: GetStaticProps = async(ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    };

    //return a props com objeto episode preenchido
    //revalidate -> definição de quanto em quanto tempo será atualizado
    return {
        props:{
            episode,
        },
        revalidate: 60 * 60 * 24 // 24 horas
    }
}