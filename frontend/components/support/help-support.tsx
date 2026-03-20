'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  X,
  ChevronRight,
  BookOpen,
  FileText,
  Video,
  MessageSquare,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
}

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showCallbackDialog, setShowCallbackDialog] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I buy gold or silver?',
      answer: 'Go to the "Buy Gold/Silver" section, select the metal type (24K Gold, 22K Gold, or Silver), choose the quantity in grams or amount in ₹, complete KYC verification, and proceed to payment.',
      category: 'purchase',
    },
    {
      id: '3',
      question: 'How do I set up price alerts?',
      answer: 'Go to "Price Alerts" section, click "New Alert", select the metal type, set your target price and condition (above/below), and save. You\'ll receive notifications when the price reaches your target.',
      category: 'alerts',
    },
    {
      id: '4',
      question: 'How do I get delivery of my gold/silver?',
      answer: 'After completing payment, go to "Deliveries" section. Click "Get Delivery" for your paid purchase. You\'ll receive an OTP. Visit the store and provide the OTP to complete delivery.',
      category: 'delivery',
    },
    {
      id: '5',
      question: 'How do I enable 2FA?',
      answer: 'Go to "Security" section, click "Enable" on Two-Factor Authentication, choose your preferred method (SMS, Email, or Authenticator App), and follow the setup instructions.',
      category: 'security',
    },
    {
      id: '6',
      question: 'How do I export my transaction history?',
      answer: 'Go to "Transactions" section, use filters if needed, and click "Export CSV" or "Export PDF" button to download your complete transaction history.',
      category: 'transactions',
    },
    {
      id: '7',
      question: 'What KYC documents are required?',
      answer: 'You need to provide PAN card number and Aadhaar card number during registration. These are mandatory for all transactions as per RBI guidelines.',
      category: 'kyc',
    },
    {
      id: '8',
      question: 'How do I view my portfolio?',
      answer: 'Go to "Portfolio" section to see all your gold and silver holdings, current values, and purchase history. The dashboard shows your total holdings in grams and current market value.',
      category: 'portfolio',
    },
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started Guide',
      content: 'Learn how to create an account, complete KYC, and make your first purchase.',
      category: 'getting-started',
    },
    {
      id: '2',
      title: 'Understanding Gold Purity',
      content: '24K gold is 99.9% pure, while 22K gold is 91.6% pure. Learn about purity standards and pricing.',
      category: 'education',
    },
    {
      id: '3',
      title: 'Payment Methods',
      content: 'We accept UPI, credit/debit cards, net banking, and digital wallets. All payments are secure and encrypted.',
      category: 'payment',
    },
    {
      id: '4',
      title: 'Delivery Options',
      content: 'Choose between home delivery (with insurance) or store pickup. Track your order in real-time.',
      category: 'delivery',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'purchase', label: 'Purchasing' },
    { id: 'alerts', label: 'Price Alerts' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'security', label: 'Security' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'kyc', label: 'KYC' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestCallback = () => {
    if (!callbackPhone) {
      toast.error('Please enter your phone number');
      return;
    }
    toast.success('Callback requested! Our team will call you within 30 minutes.');
    setShowCallbackDialog(false);
    setCallbackPhone('');
  };

  const handleStartChat = () => {
    toast.info('Chat feature coming soon! For now, please use callback or email support.');
    setShowChatDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        <p className="text-muted-foreground">
          Find answers to your questions or get in touch with our support team
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowChatDialog(true)}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowCallbackDialog(true)}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Request Callback</h3>
                <p className="text-sm text-muted-foreground">We'll call you back</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <Mail className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@goldsilver.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No FAQs found matching your search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <FAQItem key={faq.id} faq={faq} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Help Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {helpArticles.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <h3 className="font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{article.content}</p>
                <Button variant="ghost" size="sm">
                  Read More
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Support Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                Saturday: 10:00 AM - 4:00 PM IST<br />
                Sunday: Closed
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Details</h3>
              <p className="text-sm text-muted-foreground">
                Phone: +91 1800-XXX-XXXX<br />
                Email: support@goldsilver.com<br />
                Address: Mumbai, Maharashtra, India
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Live Chat Support</DialogTitle>
            <DialogDescription>
              Chat with our support team for instant help
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              Live chat is currently being set up. Please use callback or email support for now.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setShowChatDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowChatDialog(false);
                setShowCallbackDialog(true);
              }}>
                Request Callback Instead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Callback Dialog */}
      <Dialog open={showCallbackDialog} onOpenChange={setShowCallbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Callback</DialogTitle>
            <DialogDescription>
              Enter your phone number and we'll call you back within 30 minutes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="+91 1234567890"
                value={callbackPhone}
                onChange={(e) => setCallbackPhone(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCallbackDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleRequestCallback}>
                Request Callback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="font-medium">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 text-sm text-muted-foreground border-t bg-muted/30">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
