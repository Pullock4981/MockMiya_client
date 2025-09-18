import Hero from "@/components/Hero";
import FAQ from "@/Sections/FAQ";
import Features from "@/Sections/Feature";

export default function Home() {
  return (
    <div
      style={{
        background:
          "radial-gradient(125% 125% at 20% 80%, #000000 30%, #123225 110%)",
      }}>
      <Hero></Hero>
      <Features></Features>
      <FAQ></FAQ>
    </div>
  );
}
