import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.activities': 'Activities',
    'nav.poojas': 'Poojas',
    'nav.events': 'Events',
    'nav.gallery': 'Gallery',
    'nav.slokas': 'Slokas',
    'nav.contact': 'Contact & Feedback',
    'nav.donate': 'Donate',
    'nav.title': 'Shri Raghavendra Seva Trust Honali',
    'nav.subtitle': 'Rayara Matta Honali',
    'nav.menu': 'Menu',

    // Hero
    'hero.title': 'Rayara Matta Honali',
    'hero.mantra': '"Om Sri Raghavendraya Namaha"',

    // Welcome
    'welcome.title': 'Welcome to Honali Rayara Mutt',
    'welcome.desc': 'Shri Raghavendra Swamy Seva Trust, Honali is a spiritual oasis dedicated to the teachings and grace of Guru Raghavendra. Located in the serene town of Honali, our Mutt serves as a center for devotion, Vedic learning, and social service.',
    'welcome.poojas.title': 'Daily Poojas',
    'welcome.poojas.desc': 'Experience the divine presence through our meticulously performed daily rituals.',
    'welcome.goshala.title': 'Goshala',
    'welcome.goshala.desc': 'Support our mission to protect and care for the sacred cows in our Goshala.',
    'welcome.online.title': 'Online Seva',
    'welcome.online.desc': 'Book your sevas and offerings from the comfort of your home.',
    'welcome.more': 'Learn More',
    'welcome.view': 'View Schedule',
    'welcome.book': 'Book Now',

    // About
    'about.legacy': 'Our Legacy',
    'about.title': 'The History of Honali Rayara Mutt',
    'about.p1': 'In the early 1980s, two philanthropic devotees of Sri Raghavendra Swamy offered more than two grounds of land at Honali free of cost with a specific request to construct a temple for Sri Raghavendra Swamy to benefit a large number of public living in and around the area.',
    'about.p2': 'A committee of like-minded persons was formed and the site donated was taken over by the entity in the name and style of "Shri Raghavendra Swamy Seva Trust, Honali" and got the organization registered in December 1983.',
    'about.p3': 'Appeals were made soliciting donations for taking up the construction of the Brindavana by various means including conducting of Bhajans, Unchivathis at various parts of the city, newspaper advertisements, door to door collection from devotees, celebration of Sri Raghavendra Swamy Aradhana, conduct of fund raising cultural programmes, etc.',
    'about.years': 'Years of Devotion',
    'about.excellence': 'Spiritual Excellence',
    'about.excellence.desc': 'Maintaining the highest standards of Vedic rituals and traditions.',
    'about.community': 'Community Service',
    'about.community.desc': 'Supporting the local community through various social initiatives.',
    'about.heritage': 'Rich Heritage',
    'about.heritage.desc': 'Preserving the legacy of Guru Raghavendra for future generations.',

    // Activities
    'act.title': 'Our Activities',
    'act.desc': 'Beyond spiritual rituals, we are committed to social welfare and preservation of our cultural values.',
    'act.goshala.label': 'Goshala Seva',
    'act.goshala.title': 'Preserving the Sacred Cow',
    'act.goshala.desc': 'Our Goshala is home to over 50 indigenous cows. We provide them with nutritious fodder, clean water, and medical care. Godhana Seva is considered one of the most meritorious acts in our tradition.',
    'act.goshala.cows': 'Cows Protected',
    'act.goshala.fodder': 'Fresh Fodder',
    'act.virtual.title': 'Virtual Seva',
    'act.virtual.desc': 'Participate in poojas and rituals from anywhere in the world through our live streaming services.',
    'act.veda.title': 'Veda Patashala',
    'act.veda.desc': 'Traditional education for young students to preserve and propagate our ancient Vedic knowledge.',
    'act.social.title': 'Social Welfare',
    'act.social.desc': 'Free medical camps, educational support for the needy, and community feeding programs.',

    // Poojas
    'pooja.schedule': 'Daily Schedule',
    'pooja.book.title': 'Book a Seva Online',
    'pooja.book.subtitle': 'Select from the list of sacred offerings',
    'pooja.assistance.title': 'Need Assistance?',
    'pooja.assistance.desc': 'If you have any questions regarding seva bookings or special requests, please contact our office.',
    'pooja.contact': 'Contact Office',

    // Events
    'event.title': 'Upcoming Events',
    'event.news': 'Latest News',
    'event.view.all': 'View All News',

    // Gallery
    'gallery.photos': 'Photos',
    'gallery.videos': 'Videos',
    'gallery.souvenirs': 'Souvenirs',

    // Slokas
    'sloka.title': 'Sacred Slokas',
    'sloka.desc': 'Divine hymns for daily chanting and meditation',
    'sloka.meaning': 'Meaning',
    'sloka.download.title': 'Download Sloka Book',
    'sloka.download.desc': 'Get our comprehensive collection of slokas and prayers in PDF format for offline use.',
    'sloka.download.btn': 'Download PDF',

    // Contact & Feedback
    'cf.title': 'Contact & Feedback',
    'cf.desc': 'We are here to assist you and value your thoughts',
    'cf.get': 'Get in Touch',
    'cf.address': 'Address',
    'cf.phone': 'Phone',
    'cf.email': 'Email',
    'cf.hours': 'Office Hours',
    'cf.send': 'Send Message',
    'cf.feedback': 'Give Feedback',
    'cf.name': 'Full Name',
    'cf.subject': 'Subject',
    'cf.msg': 'Message',
    'cf.rate': 'Rate your experience',
    'cf.location': 'Location',
    'cf.comments': 'Your Comments',
    'cf.submit': 'Submit',

    // Donate
    'donate.title': 'Support the Trust',
    'donate.desc': 'Your generous contributions help us maintain the temple, conduct daily poojas, and support our various social activities including the Goshala.',
    'donate.bank.title': 'Bank Transfer',
    'donate.online.title': 'Online Payment',
    'donate.online.scan': 'Scan QR code to pay via any UPI app',
    'donate.note': '* All donations are exempt under section 80G of the Income Tax Act. Please share your transaction details to our email for the receipt.',

    // Booking
    'booking.title': 'Book Seva',
    'booking.price': 'Price',
    'booking.steps.user': 'User Details',
    'booking.steps.pooja': 'Pooja Info',
    'booking.steps.summary': 'Summary',
    'booking.steps.payment': 'Payment',
    'booking.form.name': 'Full Name*',
    'booking.form.name.placeholder': 'Enter your name',
    'booking.form.phone': 'Phone Number*',
    'booking.form.phone.placeholder': 'Enter your phone',
    'booking.form.email': 'Email Address*',
    'booking.form.email.placeholder': 'Enter your email',
    'booking.form.address': 'Address*',
    'booking.form.address.placeholder': 'Enter your full address',
    'booking.btn.cancel': 'Cancel',
    'booking.btn.next': 'Next Step',
    'booking.btn.back': 'Back',
    'booking.btn.payment': 'Proceed to Payment',
    'booking.pooja.title': 'Pooja Information',
    'booking.pooja.date': 'Seva Date*',
    'booking.pooja.count': 'Number of Seva*',
    'booking.pooja.gothra': 'Gothra',
    'booking.pooja.nakshathra': 'Nakshathra',
    'booking.pooja.rashi': 'Rashi',
    'booking.pooja.vedha': 'Vedha',
    'booking.pooja.message': 'Message (optional)',
    'booking.pooja.message.placeholder': 'Any special instructions',
    'booking.summary.title': 'Booking Summary',
    'booking.summary.total': 'Total Amount Payable',
    'booking.payment.title': 'Payment Integration',
    'booking.payment.desc': 'You are being redirected to our secure payment gateway to complete the transaction of',

    // Footer
    'footer.about.title': 'About the Trust',
    'footer.about.desc': 'Shri Raghavendra Swamy Seva Trust, Honali is dedicated to the service of Guru Raghavendra and the welfare of the community through spiritual and social activities.',
    'footer.contact.title': 'Contact Us',
    'footer.contact.address': 'Venkateswara Nagar (West), Honali, Karnataka - 577217',
    'footer.timings.title': 'Darsana Timings',
    'footer.timings.morning': 'Morning',
    'footer.timings.evening': 'Evening',
    'footer.timings.thursday': '(Open till 08:00 PM on Thursdays)',
    'footer.location.title': 'Location',
  },
  kn: {
    // Navbar
    'nav.home': 'ಮನೆ',
    'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'nav.activities': 'ಚಟುವಟಿಕೆಗಳು',
    'nav.poojas': 'ಪೂಜೆಗಳು',
    'nav.events': 'ಕಾರ್ಯಕ್ರಮಗಳು',
    'nav.gallery': 'ಗ್ಯಾಲರಿ',
    'nav.slokas': 'ಶ್ಲೋಕಗಳು',
    'nav.contact': 'ಸಂಪರ್ಕ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
    'nav.donate': 'ದೇಣಿಗೆ',
    'nav.title': 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸೇವಾ ಟ್ರಸ್ಟ್ ಹೊನ್ನಾಳಿ',
    'nav.subtitle': 'ರಾಯರ ಮಠ ಹೊನ್ನಾಳಿ',
    'nav.menu': 'ಪಟ್ಟಿ',

    // Hero
    'hero.title': 'ರಾಯರ ಮಠ ಹೊನ್ನಾಳಿ',
    'hero.mantra': '"ಓಂ ಶ್ರೀ ರಾಘವೇಂದ್ರಾಯ ನಮಃ"',

    // Welcome
    'welcome.title': 'ಹೊನ್ನಾಳಿ ರಾಯರ ಮಠಕ್ಕೆ ಸುಸ್ವಾಗತ',
    'welcome.desc': 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಸೇವಾ ಟ್ರಸ್ಟ್, ಹೊನ್ನಾಳಿ ಗುರು ರಾಘವೇಂದ್ರರ ಬೋಧನೆಗಳು ಮತ್ತು ಅನುಗ್ರಹಕ್ಕೆ ಸಮರ್ಪಿತವಾದ ಆಧ್ಯಾತ್ಮಿಕ ಓಯಸಿಸ್ ಆಗಿದೆ. ಹೊನ್ನಾಳಿಯ ಪ್ರಶಾಂತ ಪಟ್ಟಣದಲ್ಲಿರುವ ನಮ್ಮ ಮಠವು ಭಕ್ತಿ, ವೇದ ಕಲಿಕೆ ಮತ್ತು ಸಮಾಜ ಸೇವೆಯ ಕೇಂದ್ರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
    'welcome.poojas.title': 'ದೈನಂದಿನ ಪೂಜೆಗಳು',
    'welcome.poojas.desc': 'ನಮ್ಮ ನಿಖರವಾಗಿ ನಿರ್ವಹಿಸಲಾದ ದೈನಂದಿನ ವಿಧಿವಿಧಾನಗಳ ಮೂಲಕ ದೈವಿಕ ಉಪಸ್ಥಿತಿಯನ್ನು ಅನುಭವಿಸಿ.',
    'welcome.goshala.title': 'ಗೋಶಾಲೆ',
    'welcome.goshala.desc': 'ನಮ್ಮ ಗೋಶಾಲೆಯಲ್ಲಿರುವ ಪವಿತ್ರ ಹಸುಗಳನ್ನು ರಕ್ಷಿಸುವ ಮತ್ತು ಆರೈಕೆ ಮಾಡುವ ನಮ್ಮ ಮಿಷನ್ ಅನ್ನು ಬೆಂಬಲಿಸಿ.',
    'welcome.online.title': 'ಆನ್‌ಲೈನ್ ಸೇವೆ',
    'welcome.online.desc': 'ನಿಮ್ಮ ಮನೆಯ ಸೌಕರ್ಯದಿಂದ ನಿಮ್ಮ ಸೇವೆಗಳು ಮತ್ತು ಅರ್ಪಣೆಗಳನ್ನು ಬುಕ್ ಮಾಡಿ.',
    'welcome.more': 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
    'welcome.view': 'ವೇಳಾಪಟ್ಟಿ ನೋಡಿ',
    'welcome.book': 'ಈಗಲೇ ಬುಕ್ ಮಾಡಿ',

    // About
    'about.legacy': 'ನಮ್ಮ ಪರಂಪರೆ',
    'about.title': 'ಹೊನ್ನಾಳಿ ರಾಯರ ಮಠದ ಇತಿಹಾಸ',
    'about.p1': '1980 ರ ದಶಕದ ಆರಂಭದಲ್ಲಿ, ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳ ಇಬ್ಬರು ಲೋಕೋಪಕಾರಿ ಭಕ್ತರು ಹೊನ್ನಾಳಿಯಲ್ಲಿ ಎರಡು ಮೈದಾನಗಳಿಗಿಂತ ಹೆಚ್ಚಿನ ಭೂಮಿಯನ್ನು ಉಚಿತವಾಗಿ ನೀಡಿದರು, ಈ ಪ್ರದೇಶದ ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಹೆಚ್ಚಿನ ಸಂಖ್ಯೆಯ ಸಾರ್ವಜನಿಕರಿಗೆ ಅನುಕೂಲವಾಗುವಂತೆ ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳಿಗೆ ದೇವಾಲಯವನ್ನು ನಿರ್ಮಿಸಲು ನಿರ್ದಿಷ್ಟ ವಿನಂತಿಯೊಂದಿಗೆ.',
    'about.p2': 'ಸಮಾನ ಮನಸ್ಕ ವ್ಯಕ್ತಿಗಳ ಸಮಿತಿಯನ್ನು ರಚಿಸಲಾಯಿತು ಮತ್ತು ದಾನ ಮಾಡಿದ ಸೈಟ್ ಅನ್ನು "ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಸೇವಾ ಟ್ರಸ್ಟ್, ಹೊನ್ನಾಳಿ" ಎಂಬ ಹೆಸರಿನಲ್ಲಿ ಘಟಕವು ವಹಿಸಿಕೊಂಡಿತು ಮತ್ತು ಡಿಸೆಂಬರ್ 1983 ರಲ್ಲಿ ಸಂಸ್ಥೆಯನ್ನು ನೋಂದಾಯಿಸಲಾಯಿತು.',
    'about.p3': 'ನಗರದ ವಿವಿಧ ಭಾಗಗಳಲ್ಲಿ ಭಜನೆಗಳು, ಉಂಚಿವೃತ್ತಿಗಳನ್ನು ನಡೆಸುವುದು, ಪತ್ರಿಕೆ ಜಾಹೀರಾತುಗಳು, ಭಕ್ತರಿಂದ ಮನೆ-ಮನೆಗೆ ಸಂಗ್ರಹಿಸುವುದು, ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಆರಾಧನೆಯ ಆಚರಣೆ, ನಿಧಿ ಸಂಗ್ರಹ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಆಯೋಜನೆ ಸೇರಿದಂತೆ ವಿವಿಧ ವಿಧಾನಗಳ ಮೂಲಕ ಬೃಂದಾವನದ ನಿರ್ಮಾಣಕ್ಕೆ ದೇಣಿಗೆ ಕೋರಿ ಮನವಿಗಳನ್ನು ಮಾಡಲಾಯಿತು.',
    'about.years': 'ವರ್ಷಗಳ ಭಕ್ತಿ',
    'about.excellence': 'ಆಧ್ಯಾತ್ಮಿಕ ಶ್ರೇಷ್ಠತೆ',
    'about.excellence.desc': 'ವೈದಿಕ ಆಚರಣೆಗಳು ಮತ್ತು ಸಂಪ್ರದಾಯಗಳ ಉನ್ನತ ಗುಣಮಟ್ಟವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವುದು.',
    'about.community': 'ಸಮಾಜ ಸೇವೆ',
    'about.community.desc': 'ವಿವಿಧ ಸಾಮಾಜಿಕ ಉಪಕ್ರಮಗಳ ಮೂಲಕ ಸ್ಥಳೀಯ ಸಮುದಾಯವನ್ನು ಬೆಂಬಲಿಸುವುದು.',
    'about.heritage': 'ಶ್ರೀಮಂತ ಪರಂಪರೆ',
    'about.heritage.desc': 'ಭವಿಷ್ಯದ ಪೀಳಿಗೆಗಾಗಿ ಗುರು ರಾಘವೇಂದ್ರರ ಪರಂಪರೆಯನ್ನು ಸಂರಕ್ಷಿಸುವುದು.',

    // Activities
    'act.title': 'ನಮ್ಮ ಚಟುವಟಿಕೆಗಳು',
    'act.desc': 'ಆಧ್ಯಾತ್ಮಿಕ ಆಚರಣೆಗಳ ಹೊರತಾಗಿ, ನಾವು ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ ಮತ್ತು ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ ಮೌಲ್ಯಗಳ ಸಂರಕ್ಷಣೆಗೆ ಬದ್ಧರಾಗಿದ್ದೇವೆ.',
    'act.goshala.label': 'ಗೋಸೇವಾ',
    'act.goshala.title': 'ಪವಿತ್ರ ಹಸುವಿನ ಸಂರಕ್ಷಣೆ',
    'act.goshala.desc': 'ನಮ್ಮ ಗೋಶಾಲೆಯು 50 ಕ್ಕೂ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ಹಸುಗಳಿಗೆ ನೆಲೆಯಾಗಿದೆ. ನಾವು ಅವರಿಗೆ ಪೌಷ್ಟಿಕ ಮೇವು, ಶುದ್ಧ ನೀರು ಮತ್ತು ವೈದ್ಯಕೀಯ ಆರೈಕೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ. ಗೋದಾನ ಸೇವೆಯನ್ನು ನಮ್ಮ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಅತ್ಯಂತ ಪುಣ್ಯದ ಕಾರ್ಯಗಳಲ್ಲಿ ಒಂದೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ.',
    'act.goshala.cows': 'ಹಸುಗಳ ರಕ್ಷಣೆ',
    'act.goshala.fodder': 'ತಾಜಾ ಮೇವು',
    'act.virtual.title': 'ವರ್ಚುವಲ್ ಸೇವೆ',
    'act.virtual.desc': 'ನಮ್ಮ ಲೈವ್ ಸ್ಟ್ರೀಮಿಂಗ್ ಸೇವೆಗಳ ಮೂಲಕ ವಿಶ್ವದ ಎಲ್ಲಿಂದಲಾದರೂ ಪೂಜೆಗಳು ಮತ್ತು ವಿಧಿವಿಧಾನಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ.',
    'act.veda.title': 'ವೇದ ಪಾಠಶಾಲೆ',
    'act.veda.desc': 'ನಮ್ಮ ಪ್ರಾಚೀನ ವೈದಿಕ ಜ್ಞಾನವನ್ನು ಸಂರಕ್ಷಿಸಲು ಮತ್ತು ಪ್ರಚಾರ ಮಾಡಲು ಯುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಶಿಕ್ಷಣ.',
    'act.social.title': 'ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ',
    'act.social.desc': 'ಉಚಿತ ವೈದ್ಯಕೀಯ ಶಿಬಿರಗಳು, ಅಗತ್ಯವಿರುವವರಿಗೆ ಶೈಕ್ಷಣಿಕ ಬೆಂಬಲ ಮತ್ತು ಸಮುದಾಯ ಆಹಾರ ಕಾರ್ಯಕ್ರಮಗಳು.',

    // Poojas
    'pooja.schedule': 'ದೈನಂದಿನ ವೇಳಾಪಟ್ಟಿ',
    'pooja.book.title': 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
    'pooja.book.subtitle': 'ಪವಿತ್ರ ಅರ್ಪಣೆಗಳ ಪಟ್ಟಿಯಿಂದ ಆರಿಸಿ',
    'pooja.assistance.title': 'ಸಹಾಯ ಬೇಕೇ?',
    'pooja.assistance.desc': 'ಸೇವಾ ಬುಕಿಂಗ್ ಅಥವಾ ವಿಶೇಷ ವಿನಂತಿಗಳ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಹೊಂದಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮ್ಮ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    'pooja.contact': 'ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ',

    // Events
    'event.title': 'ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು',
    'event.news': 'ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು',
    'event.view.all': 'ಎಲ್ಲಾ ಸುದ್ದಿಗಳನ್ನು ನೋಡಿ',

    // Gallery
    'gallery.photos': 'ಫೋಟೋಗಳು',
    'gallery.videos': 'ವೀಡಿಯೊಗಳು',
    'gallery.souvenirs': 'ಸ್ಮರಣಿಕೆಗಳು',

    // Slokas
    'sloka.title': 'ಪವಿತ್ರ ಶ್ಲೋಕಗಳು',
    'sloka.desc': 'ದೈನಂದಿನ ಜಪ ಮತ್ತು ಧ್ಯಾನಕ್ಕಾಗಿ ದೈವಿಕ ಸ್ತೋತ್ರಗಳು',
    'sloka.meaning': 'ಅರ್ಥ',
    'sloka.download.title': 'ಶ್ಲೋಕ ಪುಸ್ತಕವನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    'sloka.download.desc': 'ಆಫ್‌ಲೈನ್ ಬಳಕೆಗಾಗಿ ಪಿಡಿಎಫ್ ರೂಪದಲ್ಲಿ ನಮ್ಮ ಸಮಗ್ರ ಶ್ಲೋಕಗಳು ಮತ್ತು ಪ್ರಾರ್ಥನೆಗಳ ಸಂಗ್ರಹವನ್ನು ಪಡೆಯಿರಿ.',
    'sloka.download.btn': 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',

    // Contact & Feedback
    'cf.title': 'ಸಂಪರ್ಕ ಮತ್ತು ಪ್ರತಿಕ್ರಿಯೆ',
    'cf.desc': 'ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವು ಇಲ್ಲಿದ್ದೇವೆ ಮತ್ತು ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಗೌರವಿಸುತ್ತೇವೆ',
    'cf.get': 'ಸಂಪರ್ಕಿಸಿ',
    'cf.address': 'ವಿಳಾಸ',
    'cf.phone': 'ದೂರವಾಣಿ',
    'cf.email': 'ಇಮೇಲ್',
    'cf.hours': 'ಕಚೇರಿ ಸಮಯ',
    'cf.send': 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
    'cf.feedback': 'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ',
    'cf.name': 'ಪೂರ್ಣ ಹೆಸರು',
    'cf.subject': 'ವಿಷಯ',
    'cf.msg': 'ಸಂದೇಶ',
    'cf.rate': 'ನಿಮ್ಮ ಅನುಭವವನ್ನು ರೇಟ್ ಮಾಡಿ',
    'cf.location': 'ಸ್ಥಳ',
    'cf.comments': 'ನಿಮ್ಮ ಕಾಮೆಂಟ್‌ಗಳು',
    'cf.submit': 'ಸಲ್ಲಿಸಿ',

    // Donate
    'donate.title': 'ಟ್ರಸ್ಟ್ ಅನ್ನು ಬೆಂಬಲಿಸಿ',
    'donate.desc': 'ನಿಮ್ಮ ಉದಾರ ದೇಣಿಗೆಗಳು ದೇವಾಲಯವನ್ನು ನಿರ್ವಹಿಸಲು, ದೈನಂದಿನ ಪೂಜೆಗಳನ್ನು ನಡೆಸಲು ಮತ್ತು ಗೋಶಾಲೆ ಸೇರಿದಂತೆ ನಮ್ಮ ವಿವಿಧ ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳನ್ನು ಬೆಂಬಲಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
    'donate.bank.title': 'ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ',
    'donate.online.title': 'ಆನ್‌ಲೈನ್ ಪಾವತಿ',
    'donate.online.scan': 'ಯಾವುದೇ ಯುಪಿಐ ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ಪಾವತಿಸಲು ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    'donate.note': '* ಎಲ್ಲಾ ದೇಣಿಗೆಗಳಿಗೆ ಆದಾಯ ತೆರಿಗೆ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 80G ಅಡಿಯಲ್ಲಿ ವಿನಾಯಿತಿ ಇದೆ. ರಶೀದಿಗಾಗಿ ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಹಿವಾಟಿನ ವಿವರಗಳನ್ನು ನಮ್ಮ ಇಮೇಲ್‌ಗೆ ಹಂಚಿಕೊಳ್ಳಿ.',

    // Booking
    'booking.title': 'ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
    'booking.price': 'ಬೆಲೆ',
    'booking.steps.user': 'ಬಳಕೆದಾರರ ವಿವರಗಳು',
    'booking.steps.pooja': 'ಪೂಜಾ ಮಾಹಿತಿ',
    'booking.steps.summary': 'ಸಾರಾಂಶ',
    'booking.steps.payment': 'ಪಾವತಿ',
    'booking.form.name': 'ಪೂರ್ಣ ಹೆಸರು*',
    'booking.form.name.placeholder': 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    'booking.form.phone': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ*',
    'booking.form.phone.placeholder': 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    'booking.form.email': 'ಇಮೇಲ್ ವಿಳಾಸ*',
    'booking.form.email.placeholder': 'ನಿಮ್ಮ ಇಮೇಲ್ ಅನ್ನು ನಮೂದಿಸಿ',
    'booking.form.address': 'ವಿಳಾಸ*',
    'booking.form.address.placeholder': 'ನಿಮ್ಮ ಪೂರ್ಣ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    'booking.btn.cancel': 'ರದ್ದುಗೊಳಿಸಿ',
    'booking.btn.next': 'ಮುಂದಿನ ಹಂತ',
    'booking.btn.back': 'ಹಿಂದೆ',
    'booking.btn.payment': 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ',
    'booking.pooja.title': 'ಪೂಜಾ ಮಾಹಿತಿ',
    'booking.pooja.date': 'ಸೇವೆಯ ದಿನಾಂಕ*',
    'booking.pooja.count': 'ಸೇವೆಗಳ ಸಂಖ್ಯೆ*',
    'booking.pooja.gothra': 'ಗೋತ್ರ',
    'booking.pooja.nakshathra': 'ನಕ್ಷತ್ರ',
    'booking.pooja.rashi': 'ರಾಶಿ',
    'booking.pooja.vedha': 'ವೇದ',
    'booking.pooja.message': 'ಸಂದೇಶ (ಐಚ್ಛಿಕ)',
    'booking.pooja.message.placeholder': 'ಯಾವುದೇ ವಿಶೇಷ ಸೂಚನೆಗಳು',
    'booking.summary.title': 'ಬುಕಿಂಗ್ ಸಾರಾಂಶ',
    'booking.summary.total': 'ಒಟ್ಟು ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ',
    'booking.payment.title': 'ಪಾವತಿ ಏಕೀಕರಣ',
    'booking.payment.desc': 'ವಹಿವಾಟನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ನಿಮ್ಮನ್ನು ನಮ್ಮ ಸುರಕ್ಷಿತ ಪಾವತಿ ಗೇಟ್‌ವೇಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ',

    // Footer
    'footer.about.title': 'ಟ್ರಸ್ಟ್ ಬಗ್ಗೆ',
    'footer.about.desc': 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿ ಸೇವಾ ಟ್ರಸ್ಟ್, ಹೊನ್ನಾಳಿ ಗುರು ರಾಘವೇಂದ್ರರ ಸೇವೆಗೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳ ಮೂಲಕ ಸಮುದಾಯದ ಕಲ್ಯಾಣಕ್ಕೆ ಸಮರ್ಪಿತವಾಗಿದೆ.',
    'footer.contact.title': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    'footer.contact.address': 'ವೆಂಕಟೇಶ್ವರ ನಗರ (ಪಶ್ಚಿಮ), ಹೊನ್ನಾಳಿ, ಕರ್ನಾಟಕ - 577217',
    'footer.timings.title': 'ದರ್ಶನ ಸಮಯ',
    'footer.timings.morning': 'ಬೆಳಿಗ್ಗೆ',
    'footer.timings.evening': 'ಸಂಜೆ',
    'footer.timings.thursday': '(ಗುರುವಾರ ರಾತ್ರಿ 08:00 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ)',
    'footer.location.title': 'ಸ್ಥಳ',
  }
};
