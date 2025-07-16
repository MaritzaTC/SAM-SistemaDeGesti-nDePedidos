/* eslint-disable @typescript-eslint/no-explicit-any */
import Footer from "@/components/client/Footer";
import FeaturedProducts from "@/components/client/FeaturedProducts/intex";
import Features from "@/components/client/Features";
import Hero from "@/components/client/Hero";

//import DashboardE from "@/components/admin/DashboardE";

const Home = () => (
  <main >

    {/* Admin Section */}
    {/* <DashboardE></DashboardE> */}
    
    {/* Uncomment the following lines to include client components */}
    
    {/* Client Section */}
    <Hero></Hero>
    <FeaturedProducts></FeaturedProducts>
    <Features></Features>
    <Footer></Footer>
  </main>
);

// Home.noAuth = true;
// Home.noLayout = false;
(Home as any).noAuth = true;
export default Home;
