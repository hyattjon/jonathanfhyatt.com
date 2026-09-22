import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './sections/Home';
import CV from './sections/CV';
import Projects from './sections/Projects';
import GitHub from './sections/GitHub';

export default function App() {
  return (
    <>
      <Nav />
      <main className="page">
        <Home />
        <CV />
        {/* <WritingSample /> */}
        <Projects />
        <GitHub />
      </main>
      <Footer />
    </>
  );
}
