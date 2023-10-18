import Image from "next/image";
import HeroImage from '../public/hero.webp'
import { Logo } from "@/components/Logo/Logo";
import Link from "next/link";

export default function Home() {
  
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="home-dialog">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn text-left">
          Begin
        </Link>
      </div> 
    </div> 
  )
}
