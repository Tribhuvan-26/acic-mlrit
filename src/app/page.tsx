/* eslint-disable @next/next/no-img-element */
import { AirplaneTakeoff, ArrowLeft, ArrowRight, ArrowUp, Brain, Briefcase, Bus, CarSimple, CheckCircle, Cpu, Cube, Desktop, Drone, EnvelopeSimple, Gauge, GraduationCap, HandHeart, InstagramLogo, Lightbulb, Lightning, LinkedinLogo, List, MagnifyingGlass, MapPin, MegaphoneSimple, Network, Palette, Plant, Plug, Plus, Printer, Recycle, Robot, RocketLaunch, Scales, Scissors, Student, Thermometer, Tractor, Users, UsersThree, WaveSine, Waveform, Wrench, XLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import Effects from "./Effects";

export default function Home() {
  return (
    <>


<nav id="nav" aria-label="Primary">
  <a href="#home" className="logo">ACIC<b>.</b></a>
  <button id="mt" aria-label="Open menu" aria-expanded="false"><List /></button>
  <div className="links">
    <a className="l on" href="#home">Home</a>
    <a className="l" href="#about">About</a>
    <a className="l" href="#focus">Focus Areas</a>
    <a className="l" href="#programs">Programs</a>
    <a className="l" href="#incubation">Incubation</a>
    <a className="l" href="#makerspace">Makerspace</a>
    <a className="l" href="#faq">FAQs</a>
    <a className="l" href="#contact">Contact</a>
  </div>
</nav>

<main>
<section className="hero" id="home">
  <div className="hero-deco" aria-hidden="true">
    <span className="d-ring" /><span className="d-tri" /><span className="d-tri2" /><span className="d-dots" />
    <span className="d-star d-s1">✦</span><span className="d-star d-s2">✦</span><span className="d-star d-s3">✦</span>
  </div>
  <div className="wrap">
    <div>
      <div className="hand in-1">Atal Community Innovation Centre, MLRIT</div>
      <h1 className="big in-2">Empowering<br /><span className="out">Innovations</span><br />for Bharath</h1>
      <p className="in-3">We identify, build and nurture sustainable communities through innovation.</p>
      <div className="cta in-3">
        <a className="btn" href="#incubation">Apply now <ArrowRight /></a>
        <a className="btn ghost" href="#programs">Our programs</a>
      </div>
    </div>
    <div className="pol" >
      <figure className="p1"><img src="/gallery/innovation-challenge.jpg" alt="Students at the MLRIT Innovation Challenge" width="900" height="600" /><figcaption>Innovation Challenge</figcaption></figure>
      <figure className="p2"><img src="/gallery/startup-lab.jpg" alt="Founders working in the MLRIT startup lab" width="900" height="600" /><figcaption>Startup Lab</figcaption></figure>
      <figure className="p3"><img src="/gallery/innovation-challenge-group.jpg" alt="Group photo of MLRIT innovators" width="700" height="466" /><figcaption>Our community</figcaption></figure>
    </div>
  </div>
</section>

<section className="stats" aria-label="At a glance">
  <div className="wrap">
    <div className="statrow">
      <div className="card stat rv"><div className="n" data-n="5">0</div><div className="t">Focus areas</div></div>
      <div className="card stat rv" style={{"--i": "1"} as React.CSSProperties}><div className="n" data-n="8" data-s="+">0</div><div className="t">Programs</div></div>
      <div className="card stat rv" style={{"--i": "2"} as React.CSSProperties}><div className="n" data-n="3">0</div><div className="t">Month pre-incubation</div></div>
      <div className="card stat rv" style={{"--i": "3"} as React.CSSProperties}><div className="n" data-n="6">0</div><div className="t">Month incubation</div></div>
    </div>
    <p className="notice rv"><MegaphoneSimple style={{"color": "var(--o)", "fontSize": "20px"} as React.CSSProperties} /><span><b>Pre-Incubation cohort applications are open.</b> Apply soon to secure your spot.</span></p>
  </div>
</section>

<section id="about">
  <div className="wrap">
    <div className="about">
      <div>
        <span className="chip rv">Our purpose</span>
        <h2 className="rv">About ACIC MLRIT</h2>
        <p className="lead rv">Atal Innovation Mission (AIM), NITI Aayog, promotes a culture of innovation and entrepreneurship across India by supporting institutions to set up Atal Community Innovation Centres. MLRIT was selected by AIM and approved to establish an ACIC on its campus.</p>
        <p className="vision rv">Our vision is to encourage entrepreneurship in underserved regions by providing enabling infrastructure and an environment for innovation.</p>
      </div>
      <img className="rv" src="/gallery/innovation-challenge-group.jpg" alt="MLRIT innovators gathered at an innovation event" width="700" height="466" loading="lazy" />
    </div>
    <div className="objs">
      <div className="rv"><Lightbulb /><h3>Innovative mindset</h3><p>Build an innovative mindset and the drive for entrepreneurship in the community.</p></div>
      <div className="rv" style={{"--i": "1"} as React.CSSProperties}><GraduationCap /><h3>Knowledge and skills</h3><p>Grow the knowledge, skills and abilities needed to build new products and services.</p></div>
      <div className="rv" style={{"--i": "2"} as React.CSSProperties}><Cube /><h3>Design and prototyping</h3><p>Promote design thinking with infrastructure for prototypes and MVPs.</p></div>
      <div className="rv"><Network /><h3>Startup ecosystem</h3><p>Connect academia, industry, incubators, financiers and Government.</p></div>
      <div className="rv" style={{"--i": "1"} as React.CSSProperties}><UsersThree /><h3>Expert mentors</h3><p>Build a sector-specific mentor pool from academia and industry.</p></div>
      <div className="rv" style={{"--i": "2"} as React.CSSProperties}><Scales /><h3>Support services</h3><p>Legal, IPR, funding and market access to make startups sustainable.</p></div>
    </div>
  </div>
</section>

<section className="focus" id="focus">
  <div className="wrap">
    <h2 className="rv">Focus areas</h2>
    <p className="lead rv">We back innovators solving real community problems across five sectors, from the rural economy to emerging technology.</p>
    <div className="bento">
      <div className="card w2 b-agri rv"><Plant className="art" aria-hidden="true" /><div className="ico"><Plant /></div><h3>Agriculture</h3><p>Automation, waste recycling and value addition for a sustainable rural economy.</p><div className="tags"><span>Animal husbandry</span><span>Crop cultivation</span><span>Farming techniques</span><span>Food technology</span><span>Agro processing</span></div></div>
      <div className="card rv" style={{"--i": "1"} as React.CSSProperties}><div className="ico"><Palette /></div><h3>Art and culture</h3><p>Reimagining creative and cultural heritage.</p><div className="tags"><span>Visual arts</span><span>Performing arts</span><span>Cultural heritage</span></div></div>
      <div className="card rv" style={{"--i": "2"} as React.CSSProperties}><div className="ico"><HandHeart /></div><h3>Social impact</h3><p>Ventures that uplift communities.</p><div className="tags"><span>Skill development</span><span>Education</span><span>Poverty alleviation</span></div></div>
      <div className="card b-tint rv"><div className="ico" style={{"background": "#fff"} as React.CSSProperties}><Recycle /></div><h3>Sustainability</h3><p>Green ideas for a circular future.</p><div className="tags"><span>Renewable energy</span><span>Waste management</span><span>Green tech</span></div></div>
      <div className="card rv" style={{"--i": "1"} as React.CSSProperties}><div className="ico"><Cpu /></div><h3>Technology</h3><p>Digital and deep-tech products built for Bharat.</p><div className="tags"><span>AI and ML</span><span>IoT</span><span>Software</span></div></div>
      <div className="card w2 b-cta rv" style={{"--i": "2"} as React.CSSProperties}><div className="ico"><Tractor /></div><h3>Solving for agriculture and the rural economy?</h3><p>We are calling for startups working on farm automation, agri-waste recycling, value addition to farm and forest produce, aggregation models and local rural employment.</p><a className="btn pri" href="#incubation">Apply now <ArrowRight /></a></div>
    </div>
  </div>
</section>

<section id="journey">
  <div className="wrap center">
    <h2 className="rv">From idea to startup</h2>
    <p className="lead rv">Pre-incubation takes you to a working MVP. Incubation takes it to market.</p>
    <div className="steps">
      <div className="rv"><div className="num"><Users /></div><h3>Understand</h3><p>Map your target customers</p></div>
      <div className="rv" style={{"--i": "1"} as React.CSSProperties}><div className="num"><MagnifyingGlass /></div><h3>Validate</h3><p>Explore and validate the customer problem</p></div>
      <div className="rv" style={{"--i": "2"} as React.CSSProperties}><div className="num"><Cube /></div><h3>Prototype</h3><p>Design and test your MVP</p></div>
      <div className="rv" style={{"--i": "3"} as React.CSSProperties}><div className="num"><Briefcase /></div><h3>Business model</h3><p>Build a model that sustains itself</p></div>
      <div className="rv" style={{"--i": "4"} as React.CSSProperties}><div className="num"><RocketLaunch /></div><h3>Scale</h3><p>Pilots, IPR and Demo Day with investors</p></div>
    </div>
  </div>
</section>

<section className="programs" id="programs">
  <div className="wrap">
    <div className="phead">
      <div><span className="chip rv">Programs</span><h2 className="rv">Featured programs</h2>
      <p className="lead rv">For students, rural youth, community innovators and early-stage startups, supported by Atal Innovation Mission.</p></div>
      <div className="arrows rv"><button data-d="-1" aria-label="Previous programs"><ArrowLeft /></button><button data-d="1" aria-label="Next programs"><ArrowRight /></button></div>
    </div>
    <div className="rail" id="rail" tabIndex={0} aria-label="Programs list">
      <div className="card"><div className="ico"><Plant /></div><h3>Grassroots Innovation Program</h3><p>Design thinking, problem-solving and analytical skills for rural youth aged 18 to 22, with makerspace access and certification.</p><span className="badge">4 months</span></div>
      <div className="card"><div className="ico"><Bus /></div><h3>Innovation Yatra</h3><p>A bus journey through Telangana's innovation ecosystem to meet the grassroots innovators of rural Telangana.</p><span className="badge">5 days</span></div>
      <div className="card"><div className="ico"><UsersThree /></div><h3>Community Innovator Fellowship</h3><p>A year-long intensive fellowship for aspiring community innovators, with AIM, NITI Aayog and UNDP India.</p><span className="badge">1 year</span></div>
      <div className="card"><div className="ico"><Student /></div><h3>Student Innovation Program</h3><p>Supported by Atal Innovation Mission, helping students turn ideas into working innovations.</p><span className="badge">Students</span></div>
      <div className="card"><div className="ico"><Brain /></div><h3>National Ideathon</h3><p>A national platform to find and accelerate sustainable, grassroots ideas for real community problems.</p><span className="badge">Ideathon</span></div>
      <div className="card"><div className="ico"><AirplaneTakeoff /></div><h3>Liftoff Accelerator</h3><p>A milestone-driven path to investor readiness for early-stage startups, with the Wadhwani Foundation, at no cost.</p><span className="badge">Free</span></div>
      <div className="card"><div className="ico"><Wrench /></div><h3>Capacity Building at ITIs</h3><p>Innovation mindset, design thinking and entrepreneurship readiness for Government ITI trainees.</p><span className="badge">Outreach</span></div>
      <div className="card"><div className="ico"><Robot /></div><h3>Summer Innovation Boot Camp</h3><p>Idea to prototype to pitch for school students, with robotics, drones, 3D printing, AI and AR/VR.</p><span className="badge">Schools</span></div>
    </div>
  </div>
</section>

<section id="incubation">
  <div className="wrap">
    <h2 className="rv">Pre-incubation and incubation</h2>
    <p className="lead rv">Bring an idea or a prototype. We provide the structure, labs and mentors to take it further.</p>
    <div className="plans">
      <div className="card plan rv">
        <h3>Pre-incubation</h3>
        <p>For anyone with an innovative idea or early prototype who wants to build an MVP. Ideas aligned to SDG 3, 9 and 11 are eligible.</p>
        <div className="price"><div><b>₹3,000</b>Program fee</div><div><b>3 months</b>Duration</div></div>
        <ul>
          <li><CheckCircle />Expert workshops from customer discovery to MVP</li>
          <li><CheckCircle />Idea validation, SWOT and stakeholder mapping tools</li>
          <li><CheckCircle />3D printing, IoT, drone and mechanical labs</li>
          <li><CheckCircle />e-Certificate on completion</li>
        </ul>
      </div>
      <div className="card plan dark rv" style={{"--i": "1"} as React.CSSProperties}>
        <h3>Incubation</h3>
        <p>For startups with a working prototype or MVP that are ready to refine strategy, validate the market and scale.</p>
        <div className="price"><div><b>₹6,000</b>Registration</div><div><b>₹2,500</b>Per month</div><div><b>6 to 12</b>Months</div></div>
        <ul>
          <li><CheckCircle />Go-to-market strategy with expert guidance</li>
          <li><CheckCircle />Support to run pilots</li>
          <li><CheckCircle />Demo Day with investors and IPR support</li>
          <li><CheckCircle />Technical and business mentors</li>
        </ul>
      </div>
    </div>

    <div className="maker" id="makerspace" style={{"marginTop": "80px", "scrollMarginTop": "90px"} as React.CSSProperties}>
      <img className="rv" src="/gallery/startup-lab.jpg" alt="Innovators working at benches in the MLRIT lab" width="900" height="600" loading="lazy" />
      <div>
        <h2 className="rv">Makerspace and sector labs</h2>
        <p className="lead rv">Equipment to design, build and test your prototype, plus co-working and virtual incubation.</p>
        <div className="pills rv">
          <span><Printer />3D printer</span>
          <span><Scissors />CO2 laser cutter</span>
          <span><Drone />UAV kits</span>
          <span><CarSimple />UGV kits</span>
          <span><Thermometer />FLIR thermal camera</span>
          <span><WaveSine />Tektronix oscilloscopes</span>
          <span><Waveform />Function generator</span>
          <span><Gauge />Yokogawa power meter</span>
          <span><Plug />Keithley multimeter</span>
          <span><Lightning />Soldering stations</span>
          <span><Desktop />Co-working desks</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="faq" id="faq">
  <div className="wrap" style={{"maxWidth": "860px"} as React.CSSProperties}>
    <h2 className="center rv">Questions, answered</h2>
    <div style={{"marginTop": "40px"} as React.CSSProperties}>
      <details className="rv"><summary>I have two ideas. Can I submit both?<Plus /></summary><p>No, one idea at a time.</p></details>
      <details className="rv"><summary>I have a team. Can we apply?<Plus /></summary><p>Yes, teams can apply.</p></details>
      <details className="rv"><summary>Who is considered for pre-incubation?<Plus /></summary><p>Graduates and current students, anyone pursuing entrepreneurship as a career, and early-stage ideas.</p></details>
      <details className="rv"><summary>Who can join the Innovation Yatra?<Plus /></summary><p>Anyone aged 18 to 35 who wants to explore communities. Degrees and marks are not considered; we look for curiosity and a passion for learning.</p></details>
      <details className="rv"><summary>Do I need to be an entrepreneur already?<Plus /></summary><p>No. Our programs are often the first step for budding entrepreneurs.</p></details>
      <details className="rv"><summary>How safe is the Yatra for women?<Plus /></summary><p>Safety is our priority. Female facilitators are available around the clock and more than half the team are women.</p></details>
    </div>
  </div>
</section>

<section className="final center">
  <div className="wrap" style={{"position": "relative"} as React.CSSProperties}>
    <h2 className="rv">Ready to build <span>for Bharath?</span></h2>
    <p className="lead rv">Bring an idea, a prototype or a growing startup. We bring mentors, a makerspace and a network to turn it into a venture your community needs.</p>
    <div className="cta rv">
      <a className="btn pri" href="#incubation">Apply now <ArrowRight /></a>
      <a className="btn" href="#contact">Contact us</a>
    </div>
  </div>
</section>
</main>

<footer id="contact">
  <div className="wrap">
    <div className="fgrid">
      <div>
        <span className="logo">ACIC<b>.</b></span>
        <div style={{"color": "#fff", "fontWeight": "600"} as React.CSSProperties}>Atal Community Innovation Centre, MLRIT</div>
        <p style={{"marginTop": "8px"} as React.CSSProperties}>Enabling infrastructure and mentorship for innovators in underserved regions.</p>
        <p className="fhand">Empowering innovations for Bharath.</p>
        {/* TODO: replace # with ACIC MLRIT social URLs */}
        <div className="soc"><a href="#" aria-label="Instagram"><InstagramLogo /></a><a href="#" aria-label="LinkedIn"><LinkedinLogo /></a><a href="#" aria-label="YouTube"><YoutubeLogo /></a><a href="#" aria-label="X"><XLogo /></a></div>
      </div>
      <div><h4>EXPLORE</h4><a href="#about">About</a><a href="#focus">Focus areas</a><a href="#programs">Programs</a><a href="#faq">FAQs</a></div>
      <div><h4>FOR STARTUPS</h4><a href="#incubation">Pre-incubation</a><a href="#incubation">Incubation</a><a href="#makerspace">Makerspace</a><a href="#makerspace">Co-working</a></div>
      <div><h4>CONTACT</h4>
        <p className="addr"><MapPin /><span>MLRIT, Dundigal, Hyderabad,<br />Telangana 500043</span></p>
        {/* TODO: confirm ACIC MLRIT email */}
        <a className="addr" href="mailto:acic@mlrit.ac.in" style={{"marginTop": "14px"} as React.CSSProperties}><EnvelopeSimple />acic@mlrit.ac.in</a>
      </div>
    </div>
    <div className="bt">© {new Date().getFullYear()} ACIC MLRIT. All rights reserved.</div>
  </div>
</footer>
<a id="top" href="#home" aria-label="Back to top"><ArrowUp /></a>
      <Effects />
    </>
  );
}
