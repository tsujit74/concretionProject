import Footer from "@/Components/Footer";
import NavBarComponent from "@/Components/Navbar";
import { store } from "@/config/reducer/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <NavBarComponent/>
        <Component {...pageProps} />
        <Footer/>
      </Provider>
    </>
  );
}
