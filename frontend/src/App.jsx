import { AsideBar } from "./components/nice_admin/aside"
import { Footer } from "./components/nice_admin/footer"
import { Header } from "./components/nice_admin/header"
function App() {

  return (
    <>
      <Header></Header>
      <AsideBar></AsideBar>

      <main className="main" id="main">
        <div className="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                <li className="breadcrumb-item active">Dashboard</li>
                </ol>
            </nav>
        </div>
      </main>
      <Footer></Footer>
    </>
  )
}

export default App
