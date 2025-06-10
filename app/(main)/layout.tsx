import { Header } from "./_components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  );
}
