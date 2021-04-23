//SPA
//SSR
//SSG

import { useEffect } from "react"
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from './home.module.scss';

//Aqui definimos tipagem do typescript (Episode)
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

//Recebemos dois arrays com tipagem (typescript) definido como Episode (acima)
type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

//Passamos os arrays de retorno com a tipagem definido.
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  //SPA
  //PROBLEMA: Se precisa das informações disponiveis assim  que a página é mostrada para o usuario e não carregadas depois
  //useEffects -> Hooks -> Dispara algo sempre que alguma coisa mudar na aplicação
  // Quando algo mudar na aplicação, quero que algo aconteça -> efeitos colaterais
  //"() => {}" -> o que quero executar
  //"[]" -> quando quero executar. Pode conter uma variável dentro e sempre que mudar, é executando o que é desejado
  //        No caso do React se quero que execute assim que o component for exibido na tela, basta passar o array vazio
  // useEffect(() => {

  //   //chamada API
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])

  return (
    // Ao importar o scss lá no começo e definir o nome "styles" conseguimos passar o seletor/classe como parâmetro.
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image width={192} height={192} objectFit="cover" src={episode.thumbnail} alt={episode.title} />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocal episodio" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>

    </div>
    )
  }
  

//SSR
//Server Side Rendering, ou Renderização do Lado do Servidor. -> feito pelo Next.js
//Requisição é feito pelo Next então quando o conteudo for exibido para o usuário final, já vai ter o conteudo API disponível
//Executa toda vez que alguem acessa a home da aplicação.
// export async function getServerSideProps(){
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props:{
//       episodes: data,
//     }
//   }
// }


//SSG
//Como não tem muita movimentação de dados, (inclusão de novo podcast) 1 vez ao diz (exemplo desse caso), é gerado um HTML estatico e 
//terá atualização somente 1 vez ao dia. Ex: revalidate: 60 * 60 * 8, -> revalidate: 60segundos * 60 * 8, (60 * 60 = 1 hora -> * 8 = 8 horas)
//resultado = a cada 8 horas

//Retorno NAO TIPADO -> export async function getStaticProps(){
//Retorno tipado (Typescript) assinatura abaixo
export const getStaticProps: GetStaticProps = async () =>{
  //usando fetch
  // const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc')
  // const data = await response.json()

  //usando axios
  const { data } = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  //Percorrendo todos os episódios e retornando os seguintes dados a seguir
  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    };
  })

  //Percorrendo os episódios e retornando os dois últimos episódios incluidos
  const latestEpisodes = episodes.slice(0, 2);

  //Percorrendo os episódios e retornando os todos menos os dois da linha anterior
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props:{
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, // 8 horas
  }
}
