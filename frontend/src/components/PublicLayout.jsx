import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-dark-50">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
