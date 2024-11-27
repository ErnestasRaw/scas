
import './styles/globals.css'; 
import Header from '../components/utils/header'; 
import { Provider } from  "./provider";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body>
          <Header />
          <Toaster position="bottom-center" />
          {children}
        </body>
      </Provider>
    </html>
  );
}
