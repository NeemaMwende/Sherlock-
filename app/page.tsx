import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Shield,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Globe,
  TrendingUp,
  Award,
  Lock,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Sherlock</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary transition">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition">
              Testimonials
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 lg:py-32">
            <Badge className="mb-4" variant="outline">
              <Award className="h-3 w-3 mr-1" />
              Trusted by 10,000+ Legal Professionals
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Legal Excellence,
              <br />
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your legal practice with our comprehensive case
              management platform. Streamline workflows, collaborate seamlessly,
              and deliver exceptional client service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <div className="text-gray-400">Cases Managed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for legal professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Bank-Grade Security</CardTitle>
                <CardDescription>
                  Your data is protected with AES-256 encryption, two-factor
                  authentication, and SOC 2 Type II compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Document Management</CardTitle>
                <CardDescription>
                  Organize, search, and access all your legal documents with
                  AI-powered categorization and version control
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Client Portal</CardTitle>
                <CardDescription>
                  Give clients secure access to their case information, documents,
                  and real-time updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Automated Workflows</CardTitle>
                <CardDescription>
                  Save time with automated case tracking, deadline reminders, and
                  task management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Legal Research</CardTitle>
                <CardDescription>
                  Leverage AI to conduct comprehensive legal research, analyze
                  precedents, and get instant case insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>
                  Make data-driven decisions with comprehensive analytics on case
                  performance, billing, and productivity
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get Started in Minutes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Simple setup, powerful results
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up in seconds and get instant access to your secure
                  dashboard
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Add Your Cases</h3>
                <p className="text-gray-600">
                  Import existing cases or create new ones with our intuitive
                  interface
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Manage & Grow</h3>
                <p className="text-gray-600">
                  Track progress, collaborate with your team, and deliver
                  exceptional results
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our clients have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Sherlock has completely transformed how we manage our cases.
                  The AI research feature alone has saved us countless hours."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Partner, Johnson & Associates</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "The security features give us peace of mind, and our clients
                  love the transparency of the client portal."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-gray-600">Managing Partner, Chen Law Firm</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "Best investment we've made for our practice. Intuitive,
                  powerful, and excellent customer support."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Emily Rodriguez</p>
                <p className="text-sm text-gray-600">Solo Practitioner</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of legal professionals who trust Sherlock to manage
              their cases efficiently and securely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-white text-white hover:bg-white/10"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-75">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">Sherlock</span>
              </div>
              <p className="text-gray-600 text-sm">
                Empowering legal professionals with intelligent case management
                solutions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2026 Sherlock Law Firm. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}