

## Bruno Silva - <nlw-05/>

Project #NLW 05

Dev Podcastr using ReactJs + Next.js

Example:
![Desktop](https://github.com/brunosilva/podcastr/blob/2b57c00a9d6dad6f29fa46bc3b5fbaab8f3df064/screenshots/desktop.png)
![Mobile](https://github.com/brunosilva/podcastr/blob/2b57c00a9d6dad6f29fa46bc3b5fbaab8f3df064/screenshots/mobile.png)


### Modelos de páginas - SPA, SSR e SSG

* SPA

Single Page Application

Pode mostrar conteudo renderizado na tela antes de finalizar o carregamento dos dados

  PROBLEMA: Se precisa das informações disponiveis assim  que a página é mostrada para o usuario e não carregadas depois

  useEffects -> Hooks -> Dispara algo sempre que alguma coisa mudar na aplicação

  Quando algo mudar na aplicação, quero que algo aconteça -> efeitos colaterais

  "() => {}" -> o que quero executar

  "[]" -> quando quero executar. Pode conter uma variável dentro e sempre que mudar, é executando o que é desejado. No caso do React se quero que execute assim que o component for exibido na tela, basta passar o array vazio


Exemplo de chamada:

```
  useEffect(() => {

    //chamada API
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])
```


* SSR 

Server Side Rendering, ou Renderização do Lado do Servidor. -> feito pelo Next.js

Requisição é feito pelo Next então quando o conteudo for exibido para o usuário final, já vai ter o conteudo API disponível

Executa toda vez que alguem acessa a home da aplicação.

Server Side Rendering, ou Renderização do Lado do Servidor. -> feito pelo Next.js

Requisição é feito pelo Next então quando o conteudo for exibido para o usuário final, já vai ter o conteudo API disponível

Executa toda vez que alguem acessa a home da aplicação.

Exemplo de chamada:

```
export async function getServerSideProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props:{
      episodes: data,
    }
  }
}
```

* SSG

Como não tem muita movimentação de dados, (inclusão de novo podcast) 1 vez ao dia (exemplo desse caso), é gerado um HTML estatico e terá atualização somente 1 vez ao dia ou de acordo com o calculo do `revalidate`.

Como não tem muita movimentação de dados, (inclusão de novo podcast) 1 vez ao dia (exemplo desse caso), é gerado um HTML estatico e terá atualização somente 1 vez ao dia. Ex: revalidate: 60 * 60 * 8, -> revalidate: 60segundos * 60 * 8, (60 * 60 = 1 hora -> * 8 = 8 horas) resultado = a cada 8 horas

Exemplo de chamada:

```
export const getStaticProps: GetStaticProps = async () =>{
  //usando axios -> "./services/api.ts" temos a baseURL para chamada da API
  const { data } = await api.get('episodes', {
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  //Percorrendo todos os episódios e retornando os seguintes dados a seguir de forma TIPADA
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
```

-----------------------------------------------------------------

### Gerar página(s) estática dinamicamente - [slug]






-----------------------------------------------------------------

### Para clicar no botão tocar e o podcast(audio) iniciar no component do player

Criar dentro do src uma pasta com nome "context" e dentro um file com nome referenciando o contexto desejado ex.: "PlayerContext.ts"

Fazer o import de import { createContext } from 'react';

```
import { createContext } from 'react';
```

No arquivo "_app.tsx" definir tag `<PlayerContext.Provider>` envolvendo todo conteudo que tenha necessidade de atuação do contexto como exemplo dos componentes abaixo que é necessário ficar dentro do contexto PlayerContext. `<Component {...pageProps} />` e `<Player />`

```
<PlayerContext.Provider value={'Bruno'}>
    <div className={styles.wrapper}>
        <main>
          ...
          <Component {...pageProps} />
        </main>
        <Player />
    </div>
</PlayerContext.Provider>
```

Após essas configs, consigo ir nos components `player` e `index` do diretório pages e fazer a chamada. Primeiro import `const player = useContext(PlayerContext)` e depois `{player}`



[Bruno Silva](https://www.linkedin.com/in/bruno-silva0109/)