// Home page with welcome message and opening animation
import '../../css/Home.css';

function Home() {
  return (
    <div id="home" className="container">
      <h1 className="title animate">Welcome to Locavore</h1>
      <p className="subtitle animate">Find local food vendors and share reviews!</p>
    </div>
  );
}

export default Home;