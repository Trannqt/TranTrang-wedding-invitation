import Hero from "@/pages/Hero";
import Events from "@/pages/Events";
import Location from "@/pages/Location";
import Wishes from "@/pages/Wishes";
import ImageWedding from "@/pages/ImageWedding"; 

// Main Invitation Content
export default function MainContent() {
  return (
    <>
      <Hero />
      <Location />
      <Events />
      <ImageWedding />
      <Wishes />
    </>
  );
}
