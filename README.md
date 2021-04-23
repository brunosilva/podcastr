

## Bruno Silva - <nlw-05/>

Project #NLW 05

Dev Podcastr using ReactJs + Next.js

### Modelos de páginas - SPA, SSR e SSG

* SPA

Single Page Application

Pode mostrar conteudo renderizado na tela antes de finalizar o carregamento dos dados


* SSR 

Server Side Rendering, ou Renderização do Lado do Servidor. -> feito pelo Next.js

Requisição é feito pelo Next então quando o conteudo for exibido para o usuário final, já vai ter o conteudo API disponível

Executa toda vez que alguem acessa a home da aplicação.


* SSG

Como não tem muita movimentação de dados, (inclusão de novo podcast) 1 vez ao dia (exemplo desse caso), é gerado um HTML estatico e terá atualização somente 1 vez ao dia ou de acordo com o calculo do `revalidate`.

### Gerar página(s) estática dinamicamente - [slug]






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

[Bruno Silva](https://www.linkedin.com/in/bruno-silva0109/)