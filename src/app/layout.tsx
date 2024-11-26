
import './styles/globals.css'; // Updated path
import Header from '../components/utils/header'; // Updated path

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}</body>
    </html>
  );
}
