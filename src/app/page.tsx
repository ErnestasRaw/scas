import styles from './styles/page.module.css'
import Image from 'next/image'
export default function HomePage() {





    return (
      <main className={styles.main}>
        <div className={styles.Logo}>
          <Image 
          
          src="/images/SCAS.png" 
          alt="Logo" 
          width={200} 
          height={200} 
          objectFit="contain"/>
        </div>
      </main>
    );
  }
  