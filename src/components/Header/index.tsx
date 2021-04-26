import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

import styles from './styles.module.scss';

export default function Header(){
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });

    return(
        <header className={styles.headerContainer}>
            <Link href={`/`}>
                <img src="/logo.svg" className={styles.logo}  alt="Podcastr"/>
            </Link>
            <p>O melhor para você ouvir</p>
            <span>{currentDate}</span>
        </header>
    );
}