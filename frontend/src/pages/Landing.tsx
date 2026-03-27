import { Terminal, Zap, Activity, Cpu, Lock, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Landing() {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-brand-accent/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full h-20 px-6 lg:px-[120px] flex items-center justify-between border-b border-brand-inset bg-brand-bg/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-brand-accent flex items-center justify-center text-brand-bg">
            <Terminal size={18} strokeWidth={3} />
          </div>
          <span className="font-mono font-bold text-xl tracking-[0.2em] text-white">SMART_CRM</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 font-mono text-[13px] font-medium text-brand-text-secondary tracking-wider">
          <a href="#features" className="hover:text-brand-accent transition-colors">FEATURES</a>
          <a href="#faq" className="hover:text-brand-accent transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium hover:text-brand-accent transition-colors text-slate-300">Log in</Link>
          <Link to="/register" className="text-sm font-medium hover:text-brand-accent transition-colors text-slate-300">Sign up</Link>
          <Link to="/login">
            <Button className="bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-mono font-bold px-6 py-3 rounded-md tracking-wider flex items-center gap-2">
              INITIATE_SYSTEM
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-[120px] flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-8 max-w-[900px]">
          <div className="px-4 py-2 rounded-full border border-brand-accent bg-brand-accent/10 border-opacity-50 text-brand-accent font-mono text-xs font-semibold tracking-wider">
            v2.0 // SYSTEM UPGRADE COMPLETE
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-extrabold leading-none tracking-tight text-white">
            Command Your CRM.
          </h1>
          
          <p className="text-xl lg:text-2xl text-brand-text-secondary font-regular leading-relaxed max-w-3xl">
            The data-driven backend for high-velocity sales teams. Run your pipeline with terminal precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <Link to="/login">
              <Button className="h-16 px-10 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-mono font-bold text-base rounded-md tracking-wider shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                EXECUTE_START
              </Button>
            </Link>
            <Button variant="outline" className="h-16 px-10 border-slate-700 hover:border-slate-500 bg-slate-800/20 hover:bg-slate-800/40 text-slate-200 font-mono font-semibold text-base rounded-md tracking-wider border-2 transition-all">
              VIEW_DOCS
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-[1200px] aspect-[2/1] rounded-xl bg-brand-card border border-brand-inset overflow-hidden shadow-[0_20px_80px_-20px_rgba(34,211,238,0.2)] group">
          <img 
            src="/images/redesign/PD8b8.webp" 
            alt="Technical Dashboard Mockup" 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-[120px]">
        <div className="w-full py-10 border-y border-brand-inset flex flex-wrap justify-between gap-12 lg:gap-0">
          {[
            { label: 'PIPELINE MANAGED', value: '$2.4B+' },
            { label: 'QUERY RESPONSE', value: '150ms' },
            { label: 'SYSTEM UPTIME', value: '99.99%' },
            { label: 'ACTIVE TERMINALS', value: '10k+' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-mono text-5xl font-bold tracking-tight">{stat.value}</span>
              <span className="font-mono text-xs font-medium text-brand-text-secondary tracking-[0.2em]">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-[120px] flex flex-col items-center gap-20">
        <div className="max-w-[800px] text-center flex flex-col gap-6">
          <h2 className="text-5xl lg:text-6xl font-extrabold">Uncompromising Power.</h2>
          <p className="text-xl text-brand-text-secondary leading-relaxed">
            Built for speed, accuracy, and absolute control over your sales data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1200px]">
          {[
            { 
              step: '[01]', 
              tag: 'REAL-TIME SYNC', 
              title: 'Instant Data Streams', 
              desc: 'Your pipeline updates in milliseconds across all active terminals globally.',
              img: '/images/redesign/LNkVK.webp',
              icon: <Activity size={20} />
            },
            { 
              step: '[02]', 
              tag: 'PREDICTIVE MODELLING', 
              title: 'AI-Driven Insights', 
              desc: 'Automatically identify high-value accounts and predict churn before it happens.',
              img: '/images/redesign/Qp2CW.webp',
              icon: <Cpu size={20} />
            },
            { 
              step: '[03]', 
              tag: 'BANK-GRADE SECURITY', 
              title: 'Encrypted Storage', 
              desc: 'End-to-end encryption ensures your customer data remains inaccessible.',
              img: '/images/redesign/vCwDb.webp',
              icon: <Lock size={20} />
            },
          ].map((feat, i) => (
            <div key={i} className="flex flex-col gap-6 p-10 rounded-xl bg-brand-card border border-brand-inset group hover:border-brand-accent/30 transition-all">
              <div className="w-full aspect-[2/1] rounded-md bg-brand-inset overflow-hidden border border-brand-inset group-hover:border-brand-accent/20 transition-all">
                <img src={feat.img} alt={feat.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-brand-accent tracking-wider">
                  {feat.icon}
                  <span>{feat.step} {feat.tag}</span>
                </div>
                <h3 className="text-2xl font-semibold">{feat.title}</h3>
                <p className="text-brand-text-secondary leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 lg:px-[120px] flex flex-col items-center gap-16">
        <div className="max-w-[800px] text-center flex flex-col gap-6">
          <h2 className="text-4xl lg:text-5xl font-extrabold">Frequent Interrogations.</h2>
          <p className="text-lg text-brand-text-secondary leading-relaxed">
            Resolving system queries and operational bottlenecks.
          </p>
        </div>

        <div className="w-full max-w-[800px] flex flex-col gap-6">
          {[
            { q: 'IS SYSTEM MIGRATION DESTRUCTIVE?', a: 'No. Our ingestion engine maps your existing data without loss of integrity. System state remains persistent throughout the transition.', icon: <Activity size={16} /> },
            { q: 'WHAT IS THE SYSTEM LATENCY?', a: 'Global response time is sub-150ms. Data streams are processed in real-time across our distributed edge network.', icon: <Zap size={16} /> },
            { q: 'CAN I EXECUTE CUSTOM PLUGINS?', a: 'Yes. Our open API allows for custom module deployment and integration with your existing stack via webhooks.', icon: <HelpCircle size={16} /> },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4 p-8 rounded-lg bg-brand-card border border-brand-inset">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-brand-accent tracking-wider">
                {item.icon}
                <h4>{item.q}</h4>
              </div>
              <p className="text-brand-text-secondary text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-[120px] border-t border-brand-inset bg-brand-bg flex flex-col gap-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
          <div className="flex flex-col gap-4 max-w-[300px]">
            <span className="font-mono font-bold text-2xl tracking-[0.2em]">SMART_CRM</span>
            <p className="text-brand-text-tertiary text-sm leading-relaxed">
              Optimizing the sales workflow through technical excellence.
            </p>
          </div>
          
          <div className="flex gap-20">
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs font-bold text-brand-text-secondary tracking-widest">SYSTEM</span>
              <ul className="flex flex-col gap-4 text-sm text-brand-text-tertiary">
                <li className="hover:text-brand-accent transition-colors"><a href="#">Engine</a></li>
                <li className="hover:text-brand-accent transition-colors"><a href="#">API_Docs</a></li>
                <li className="hover:text-brand-accent transition-colors"><a href="#">Status_Page</a></li>
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <span className="font-mono text-xs font-bold text-brand-text-secondary tracking-widest">PROTOCOL</span>
              <ul className="flex flex-col gap-4 text-sm text-brand-text-tertiary">
                <li className="hover:text-brand-accent transition-colors"><a href="#">Terms</a></li>
                <li className="hover:text-brand-accent transition-colors"><a href="#">Privacy</a></li>
                <li className="hover:text-brand-accent transition-colors"><a href="#">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-inset flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-mono text-[10px] text-brand-text-muted tracking-wider">© 2026 SMART_CRM_INC // ALL_RIGHTS_RESERVED</span>
          <span className="font-mono text-[10px] text-brand-text-muted tracking-wide">LOCAL_TIME: 12:59:52-03:00</span>
        </div>

        <div className="w-full h-40 rounded-xl bg-brand-inset overflow-hidden opacity-40">
           <img src="/images/redesign/BFVUh.webp" alt="Abstract Background" className="w-full h-full object-cover grayscale" />
        </div>
      </footer>
    </div>
  )
}
