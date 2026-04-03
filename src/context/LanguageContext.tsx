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
    'nav.seva-vivara': 'Seva Vivara',
    'nav.sevas': 'Seva Activities',
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
    'welcome.seva-vivara.title': 'Seva Vivara',
    'welcome.seva-vivara.desc': 'Experience the divine presence through our meticulously performed daily rituals.',
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

    // About - History
    'about.history.title': 'History',
    'about.history.desc1': 'Honnali is a sacred place situated at the confluence of the Tunga and Bhadra rivers. It is special because Sri Raghavendra Swamy himself came and settled here just two years after entering Brindavana in Mantralaya. Thus, Honali is famously known as "Dwitiya Mantralaya" (The Second Mantralaya). Every year, thousands of devotees visit the Mutt to receive the grace of Rayaru.',
    'about.history.q': 'What is the history?',
    'about.history.desc2': 'Rayaru appeared in a dream to Ramacharya of Honali Agrahara and instructed him to install his Mrittika Brindavana. When the Acharya shared this dream with the town\'s elders, they agreed. Necessary preparations were made for the installation, and a team set out from Honali to Mantralaya to bring the Mrittika. However, even on the day of the installation (Phalguna Bahula Tritiya), the team had not returned. Ramacharya was anxious while bathing in the Tungabhadra river. At that moment, a radiant Brahmin bathing in the river said, "I have come from Mantralaya. I have Rayaru\'s Mrittika with me! Shall I perform the installation?" Though surprised, the people believed it was God\'s will and agreed so as not to miss the auspicious time. The Brahmin entered the sanctum sanctorum and closed the door. He did not come out for a long time. Finally, the elders decided to open the door. To their amazement, the Brahmin had vanished! On the Brindavana, there was a copper plate containing a Narasimha Saligrama, an idol of Prana Deva, and yellow Mantrakshate. Realizing that Sri Raghavendra Swamy himself had come and resided in the Brindavana, the people were overjoyed. Since then, this place has become Dwitiya Mantralaya.',

    // About - Miracles
    'about.miracle.title': 'Miracles',
    'about.miracle.q': 'What are the miracles?',
    'about.miracle.1': 'It is believed that when Dewan Purnaiya visited the Mutt and performed circumambulations, he heard the Narayana Mantra being chanted from inside the Brindavana.',
    'about.miracle.2': 'The construction of the Honali Mutt\'s prakara was guided by dream instructions given to both a British government official and a contractor. This information has been recorded by a judge.',
    'about.miracle.3': 'Even today, Rayaru is said to go for a river bath during the early morning Brahmi Muhurta. Many have had his darshan, and some have shared their experience of hearing the sound of his wooden sandals (Avuge).',
    'about.miracle.4': 'Those who perform Sankalpa Seva for three days here have seen their wishes fulfilled. There are many instances of people recovering from long-term illnesses.',
    'about.miracle.5': 'Devotees from all corners of the country and state visit here to receive the blessings of Sri Raghavendra Swamy.',

    // About - Trustees
    'about.trustees.title': 'Board of Trustees',
    'about.trustees.desc': 'Shri Raghavendra Seva Trust (R.) manages the administration of the Mutt. The Trust has been successful in making the Mutt a religious and social center. It welcomes devotees with respect and honor. The members are as follows:',
    'about.trustee.1': 'H.M. Srinivasamurthy - President',
    'about.trustee.2': 'K.R. Srinivas - Vice President',
    'about.trustee.3': 'G. Vadiraja Kamaruru - Secretary',
    'about.trustee.4': 'Sudheendra Mathada - Joint Secretary',
    'about.trustee.5': 'H.S. Raghavendra - Treasurer',
    'about.trustee.6': 'N. Jayarao - Director',
    'about.trustee.7': 'C. Satyanarayanarao - Director',
    'about.trustee.8': 'M.V. Badari Narayana - Director',
    'about.trustee.9': 'H.N. Gurudatta - Director',
    'about.trustee.10': 'Rajeeva Raghavendra - Director',
    'about.trustee.11': 'S.N. Prakasha - Director',

    // Activities
    'act.title': 'Our Activities',
    'act.desc': 'Beyond spiritual rituals, we are committed to social welfare and preservation of our cultural values.',
    'act.goshala.label': 'Goshala Seva',
    'act.goshala.title': 'Preserving the Sacred Cow',
    'act.goshala.desc': 'Our Goshala is home to over 50 indigenous cows. We provide them with nutritious fodder, clean water, and medical care. Godhana Seva is considered one of the most meritorious acts in our tradition.',
    'act.goshala.cows': 'Cows Protected',
    'act.goshala.fodder': 'Fresh Fodder',
    'act.goshala.btn': 'Participate in Godana Seva',
    'act.goshala.mdl.title': 'Godana Seva',
    'act.goshala.mdl.desc': 'Support our Goshala and earn the blessings of Gomatha',
    'act.goshala.form.name': 'Full Name',
    'act.goshala.form.phone': 'Phone Number',
    'act.goshala.form.email': 'Email Address',
    'act.goshala.form.amount': 'Contribution Amount',
    'act.goshala.form.submit': 'Confirm Contribution',
    'act.goshala.form.processing': 'Processing...',
    'act.goshala.success': 'Thank you for your noble contribution to Godana Seva! May Guru Raghavendra Swamy and Gomatha bless you.',
    'act.virtual.title': 'Virtual Seva',
    'act.virtual.desc': 'Participate in poojas and rituals from anywhere in the world through our live streaming services.',
    'act.veda.title': 'Veda Patashala',
    'act.veda.desc': 'Traditional education for young students to preserve and propagate our ancient Vedic knowledge.',
    'act.social.title': 'Social Welfare',
    'act.social.desc': 'Free medical camps, educational support for the needy, and community feeding programs.',

    // Activities - Festivals
    'act.festivals.title': 'Festivals at the Mutt',
    'act.festivals.1': 'Aradhana Mahotsava of Sri Raghavendra Swamy',
    'act.festivals.2': 'Aradhanas of Sri Jayateertharu, Sri Vyasarajaru, and Sri Vadirajaru',
    'act.festivals.3': 'Religious discourses, Dhatri Homa, and various Yajnas',
    'act.festivals.4': 'Laksha Deepotsava on the last Thursday of Kartika month',
    'act.festivals.5': 'Srinivasa Kalyanotsava on Vaishakha Shuddha Dashami',

    // Poojas
    'pooja.schedule': 'Daily Schedule',
    'pooja.book.title': 'Book a Seva Online',
    'pooja.book.subtitle': 'Select from the list of sacred offerings',
    'pooja.assistance.title': 'Need Assistance?',
    'pooja.assistance.desc': 'If you have any questions regarding seva bookings or special requests, please contact our office.',
    'pooja.contact': 'Contact Office',

    // Seva Activities
    'seva.title': 'Seva Activities of the Mutt',
    'seva.1.title': 'Kamadhenu Goshala',
    'seva.1.desc': 'Over 40 cows are being protected here. Cows and calves are provided free of cost to eligible farmers and those who promise to care for them.',
    'seva.2.title': 'Blood Donation Camp',
    'seva.2.desc': 'Blood donation camps are organized twice a year at the Mutt with public cooperation. The Trust is actively involved in social service through this.',
    'seva.3.title': 'Honoring Scholars',
    'seva.3.desc': 'Religious discourses are held every month at the Mutt. A young scholar is invited and honored with a remuneration. Any scholar visiting the Mutt is treated with great respect.',
    'seva.godana.title': 'Godana Sevas',
    'seva.godana.desc': 'The Mutt has a Godana facility and provides an opportunity to offer Gomasa to the cows.',
    'seva.godana.madhyama': 'Godana Madhyama Kalpa',
    'seva.godana.uttama': 'Godana Uttama Kalpa',
    'seva.godana.salankruta': 'Godana Salankruta',
    'seva.godana.hidihullu': 'Hidi Hullu Punya Koti (Monthly)',
    'seva.book': 'Book Seva',

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
    'booking.btn.payment': 'Review & Pay',
    'booking.manual.title': 'Secure Bank Transfer',
    'booking.manual.desc': 'Please complete the payment using the details below and enter the Transaction ID to confirm your booking.',
    'booking.manual.bank.title': 'Bank Account Details',
    'booking.manual.upi.title': 'Pay via UPI',
    'booking.manual.field.utr': 'Transaction ID / UTR No.',
    'booking.manual.field.utr.placeholder': 'Enter 12-digit Ref No.',
    'booking.manual.btn.confirm': 'Confirm Booking',
    'booking.manual.success': 'Your booking request has been submitted! Our team will verify the payment and contact you soon.',
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
    'nav.seva-vivara': 'ಸೇವಾ ವಿವರ',
    'nav.sevas': 'ಸೇವಾ ಕಾರ್ಯಗಳು',
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
    'welcome.seva-vivara.title': 'ದೈನಂದಿನ ಪೂಜೆಗಳು',
    'welcome.seva-vivara.desc': 'ನಮ್ಮ ನಿಖರವಾಗಿ ನಿರ್ವಹಿಸಲಾದ ದೈನಂದಿನ ವಿಧಿವಿಧಾನಗಳ ಮೂಲಕ ದೈವಿಕ ಉಪಸ್ಥಿತಿಯನ್ನು ಅನುಭವಿಸಿ.',
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

    // About - History
    'about.history.title': 'ಇತಿಹಾಸ',
    'about.history.desc1': 'ತುಂಗಾ ಮತ್ತು ಭದ್ರಾ ನದಿಗಳು ಸಂಗಮವಾದ ಬಳಿಕ ಸಿಗುವ ಪುಣ್ಯ ಕ್ಷೇತ್ರವೇ ಹೊನ್ನಾಳಿ. ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳು ಮಂತ್ರಾಲಯದಲ್ಲಿ ಬೃಂದಾವನ ಪ್ರವೇಶಿಸಿದ ಕೇವಲ 2 ವರ್ಷದಲ್ಲಿ ಹೊನ್ನಾಳಿಯಲ್ಲಿ ಸ್ವತಃ ರಾಯರೇ ಬಂದು ಇಲ್ಲಿ ನೆಲೆಸಿದ್ದಾರೆಂಬುದೇ ವಿಶೇಷ. ಹೀಗಾಗಿ ಹೊನ್ನಾಳಿ ದ್ವಿತೀಯ ಮಂತ್ರಾಲಯ ಎಂದೇ ಖ್ಯಾತಿಯಾಗಿದೆ. ಪ್ರತಿ ವರ್ಷ ಸಾವಿರಾರು ಭಕ್ತರು ಶ್ರೀಮಠಕ್ಕೆ ಆಗಮಿಸಿ ರಾಯರ ಅನುಗೆಹಕ್ಕೆ ಪಾತ್ರರಾಗಿದ್ದಾರೆ.',
    'about.history.q': 'ಇತಿಹಾಸವೇನು?',
    'about.history.desc2': 'ಹೊನ್ನಾಳಿಯ ಅಗ್ರಹಾರದಲ್ಲಿದ್ದ ರಾಮಾಚಾರ್ಯರಿಗೆ ಸ್ವಪ್ನದಲ್ಲಿ ರಾಯರು ಬಂದು ತಮ್ಮ ಮೃತ್ತಿಕಾ ಬೃಂದಾವನವನ್ನು ಪ್ರತಿಷ್ಠಾಪಿಸುವಂತೆ ಸೂಚಿಸಿದರು. ಆ ಸ್ವಪ್ನ ಸೂಚನೆಯನ್ನು ಊರಿನ ಪ್ರಮುಖರೆದುರು ಆಚಾರರು ವಿಜ್ಞಾಪಿಸಿದಾಗ ಊರಿನ ಜನರೂ ಒಪ್ಪಿಗೆ ಸೂಚಿಸಿದರು. ಬೃಂದಾವನ ಪ್ರತಿಷ್ಠಾಪನೆ ಮಾಡಲು ಬೇಕಾದ ಅಗತ್ಯ ಸಿದ್ಧತೆಗಳು ನಡೆದವು. ಅದರಂತೆ ಮೃತ್ತಿಕಾ ತರಲು ಹೊನ್ನಾಳಿಯಿಂದ ಮಂತ್ರಾಲಯಕ್ಕೆ ತಂಡವೊಂದು ಹೊರಟಿತು. ಆದರೆ ಪ್ರತಿಷ್ಠಾಪನಾ ಮುಹೂರ್ತದ ದಿನ (ಫಾಲ್ಗುಣ ಬಹುಳ ತೃತೀಯ) ಬಂದರೂ ಮಂತ್ರಾಲಯಕ್ಕೆ ಮೃತ್ತಿಕಾ ತರಲು ಹೋಗಿದ್ದವರು ಬರಲೇ ಇಲ್ಲ. ಇದೇ ವಿಚಾರ ಮಾತನಾಡುತ್ತಾ ತುಂಗಭದ್ರಾ ನದಿಯಲ್ಲಿ ಸ್ನಾನ ಮಾಡುವ ವೇಳೆ ರಾಮಾಚಾರ್ಯರು ಪ್ರಸ್ತಾಪಿಸುತ್ತಾ ಆತಂಕಿತರಾಗಿದ್ದರು. ಈ ವೇಳೆ ನದಿಯಲ್ಲೇ ಸ್ನಾನ ಮಾಡುತ್ತಿದ್ದ ತೇಜೋಮಯರಾದ( ಬ್ರಾಹ್ಮಣ) ವ್ಯಕ್ತಿಯೊಬ್ಬರು “ನಾನು ಮಂತ್ರಾಲಯದಿಂದಲೇ ಬಂದಿದ್ದೇನೆ. ನನ್ನ ಬಳಿ ರಾಯರ ಮೃತ್ತಿಕಾ ಇದೆ!”. ನಾನು ಮುಹೂರ್ತ ನೆರವೇರಿಸಲೇ? ಎಂದು ಕೇಳುತ್ತಾರೆ. ಈ ಘಟನೆ ಅಲ್ಲಿದ್ದವರಿಗೆ ತೀರಾ ಆಶ್ಚರ್ಯವೆನಿಸಿದರೂ ಬೃಂದಾವನ ಪ್ರತಿಷ್ಠಾಪನಾ ಮುಹೂರ್ತ ಮೀರಬಾರದೆಂಬ ಕಾರಣಕ್ಕೆ ದೇವರ ಸಂಕಲ್ಪವೇ ಇದಾಗಿರಬೇಕೆಂದು ಭಾವಿಸಿ ಸಮ್ಮತಿಸುತ್ತಾರೆ. ಮೃತ್ತಿಕಾ ಇದೆ ಎಂದ ಬ್ರಾಹ್ಮಣ ತಾನು ಗರ್ಭಗುಡಿಯ ಒಳಗೆ ಹೋಗಿ ಬಾಗಿಲು ಹಾಕಿಕೊಳ್ಳುತ್ತಾರೆ. ಎಷ್ಟೇ ಸಮಯ ಕಳೆದರೂ ಹೊರಗೆ ಬರುವುದೇ ಇಲ್ಲ..! ಕೊನೆಗೆ ಊರಿನ ಪ್ರಮುಖರೆಲ್ಲರೂ ಸೇರಿ ಗರ್ಭಗುಡಿಯ ಬಾಗಿಲು ತೆಗೆದು ನೋಡಲು ನಿರ್ಧರಿಸುತ್ತಾರೆ. ನೋಡಿದರೆ ಒಳಗೆಮುಹೂರ್ತ ನೆರವೇರಿಸುತ್ತೇನೆಂದು ತೆರಳಿದ ಆ ಬ್ರಾಹ್ಮಣ ಅದೃಶ್ಯರಾಗಿರುತ್ತಾರೆ! ಬೃಂದಾವನದ ಮೇಲೆ ಒಂದು ತಾಮ್ರದ ಹರಿವಾಣದಲ್ಲಿ ನರಸಿಂಹ ಸಾಲಿಗ್ರಾಮ, ಪ್ರಾಣದೇವರ ವಿಗ್ರಹ ಮತ್ತು ಹಳದಿ ಮಂತ್ರಾಕ್ಷತೆ ಇರುತ್ತದೆ. ಈ ಘಟನೆಯಿಂದ ಚಕಿತರಾದ ಊರಿನ ಜನತೆ ಸಾಕ್ಷಾತ್ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳೇ ಇಲ್ಲಿಗೆ ಬಂದು ಸ್ವತಃ ಬೃಂದಾವದಲ್ಲಿ ಸನ್ನಿಹಿತರಾಗಿದ್ದಾರೆ ಎಂದು ಆನಂದಗೊಳ್ಳುತ್ತಾರೆ. ಅಂದಿನಿಂದ ಈ ಕ್ಷೇತ್ರ ದ್ವಿತೀಯ ಮಂತ್ರಾಲಯವಾಗುತ್ತದೆ.',

    // About - Miracles
    'about.miracle.title': 'ಪವಾಡಗಳು',
    'about.miracle.q': 'ಪವಾಡಗಳೇನು?',
    'about.miracle.1': 'ದಿವಾನ್ ಪೂರ್ಣಯ್ಯನವರು ಮಠಕ್ಕೆ ಬಂದು ಪ್ರದಕ್ಷಿಣೆ ಹಾಕುವ ಸಂದರ್ಭದಲ್ಲಿ ಬೃಂದಾವನದ ಒಳಗಿನಿಂದ ನಾರಾಯಣ ಮಂತ್ರದ ಜಪ ಮಾಡುತ್ತಿರುವ ಶಬ್ದ ಕೇಳಿಸಿದೆ ಎಂಬ ನಂಬಿಕೆ ಇದೆ.',
    'about.miracle.2': 'ಬ್ರಿಟಿಷ್ ಸರ್ಕಾರ್ ಅಧಿಕಾರಿ ಮತ್ತು ಕಂಟ್ರಾಕ್ಟರ್ ಇಬ್ಬರಿಗೂ ಸ್ವಪ್ನ ಸೂಚನೆಯ ಮೂಲಕವೇ ಹೊನ್ನಾಳಿಯ ಮಠದ ಪ್ರಕಾರದ ನಿರ್ಮಾಣವಾಗಿದೆ. ಈ ಮಾಹಿತಿಯನ್ನು ನ್ಯಾಯಾಧೀಶರೊಬ್ಬರು ದಾಖಲು ಮಾಡಿದ್ದಾರೆ.',
    'about.miracle.3': 'ಈಗಲೂ ಸಹ ಪ್ರಾತಃ ಕಾಲ ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದಲ್ಲಿ ರಾಯರು ನದಿ ಸ್ನಾನಕ್ಕೆ ತೆರಳುತ್ತಾರೆ. ಅನೇಕ ಮಂದಿಗೆ ದರ್ಶನವಾಗಿದೆ. ಕೆಲವರಿಗೆ ಆವುಗೆಯ(ಮರದ ಪಾದುಕೆ) ಶಬ್ದ ಹೇಳಿಸಿದೆ. ಈ ಅನುಭವ ಹಂಚಿಕೊಂಡಿದ್ದಾರೆ.',
    'about.miracle.4': 'ಇಲ್ಲಿ ಮೂರು ದಿನಗಳ ಕಾಲ ಸಂಕಲ್ಪ ಸಹಿತ ಸೇವಾ ಮಾಡಿದವರು ತಮ್ಮ ಇಷ್ಟಾರ್ಥಗಳನ್ನು ವಿಶೇಷವಾಗಿ ಪಡೆದಿದ್ದಾರೆ. ದೀರ್ಘ ಕಾಲದ ಕಾಯಿಲೆಗಳಿಂದ ಗುಣಮುಖರಾದ ಉದಾಹರಣೆಗಳಿವೆ.',
    'about.miracle.5': 'ದೇಶ ಹಾಗೂ ರಾಜ್ಯದ ಮೂಲೆ ಮೂಲೆಗಳಿಂದಲೂ ಭಕ್ತರು ಇಲ್ಲಿಗೆ ಆಗಮಿಸಿ ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳ ಅನುಗ್ರಹಕ್ಕೆ ಪಾತ್ರರಾಗಿದ್ದಾರೆ.',

    // About - Trustees
    'about.trustees.title': 'ಆಡಳಿತ ಮಂಡಳಿ',
    'about.trustees.desc': 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸೇವಾ ಟ್ರಸ್ಟ್(ರಿ.) ಶ್ರೀಮಠದ ಆಡಳಿತ ನಿರ್ವಹಣೆಯನ್ನು ಮಾಡುತ್ತಿದೆ. ಶ್ರೀಮಠವನ್ನು ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಕೇಂದ್ರ ಮಾಡುವಲ್ಲಿ ಟ್ರಸ್ಟ್ಯಶಸ್ವಿಯಾಗಿದೆ. ಮಠಕ್ಕೆ ಆಗಮಿಸುವ ಭಕ್ತರಿಗೆ ಗೌರವಾದರಗಳೊಂದಿಗೆ ಸ್ವಾಗತಿಸುತ್ತದೆ. ಸದಸ್ಯರ ಮಾಹಿತಿ ಇಂತಿದೆ.',
    'about.trustee.1': 'ಹೆಚ್.ಎಂ. ಶ್ರೀನಿವಾಸಮೂರ್ತಿ ಅಧ್ಯಕ್ಷರು',
    'about.trustee.2': 'ಕೆ.ಆರ್. ಶ್ರೀನಿವಾಸ್ ಉಪಾಧ್ಯಕ್ಷರು',
    'about.trustee.3': 'ಜಿ. ವಾದಿರಾಜ ಕಮರೂರು ಕಾರ್ಯದರ್ಶಿ',
    'about.trustee.4': 'ಸುಧೀಂದ್ರ ಮಠದ ಸಹ-ಕಾರ್ಯದರ್ಶಿ',
    'about.trustee.5': 'ಹೆಚ್.ಎಸ್. ರಾಘವೇಂದ್ರ ಖಜಾಂಚಿ',
    'about.trustee.6': 'ಎನ್. ಜಯರಾವ್ ನಿರ್ದೇಶಕರು',
    'about.trustee.7': 'ಸಿ. ಸತ್ಯನಾರಾಯಣರಾವ್ ನಿರ್ದೇಶಕರು',
    'about.trustee.8': 'ಎಂ.ವಿ. ಬದರೀ ನಾರಾಯಣ ನಿರ್ದೇಶಕರು',
    'about.trustee.9': 'ಹೆಚ್.ಎನ್. ಗುರುದತ್ತ ನಿರ್ದೇಶಕರು',
    'about.trustee.10': 'ರಾಜೀವ ರಾಘವೇಂದ್ರ ನಿರ್ದೇಶಕರು',
    'about.trustee.11': 'ಎಸ್.ಎನ್. ಪ್ರಕಾಶ ನಿರ್ದೇಶಕರು',

    // Activities
    'act.title': 'ನಮ್ಮ ಚಟುವಟಿಕೆಗಳು',
    'act.desc': 'ಆಧ್ಯಾತ್ಮಿಕ ಆಚರಣೆಗಳ ಹೊರತಾಗಿ, ನಾವು ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ ಮತ್ತು ನಮ್ಮ ಸಾಂಸ್ಕೃತಿಕ ಮೌಲ್ಯಗಳ ಸಂರಕ್ಷಣೆಗೆ ಬದ್ಧರಾಗಿದ್ದೇವೆ.',
    'act.goshala.label': 'ಗೋಸೇವಾ',
    'act.goshala.title': 'ಪವಿತ್ರ ಹಸುವಿನ ಸಂರಕ್ಷಣೆ',
    'act.goshala.desc': 'ನಮ್ಮ ಗೋಶಾಲೆಯು 50 ಕ್ಕೂ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ಹಸುಗಳಿಗೆ ನೆಲೆಯಾಗಿದೆ. ನಾವು ಅವರಿಗೆ ಪೌಷ್ಟಿಕ ಮೇವು, ಶುದ್ಧ ನೀರು ಮತ್ತು ವೈದ್ಯಕೀಯ ಆರೈಕೆಯನ್ನು ಒದಗಿಸುತ್ತೇವೆ. ಗೋದಾನ ಸೇವೆಯನ್ನು ನಮ್ಮ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಅತ್ಯಂತ ಪುಣ್ಯದ ಕಾರ್ಯಗಳಲ್ಲಿ ಒಂದೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ.',
    'act.goshala.cows': 'ಹಸುಗಳ ರಕ್ಷಣೆ',
    'act.goshala.fodder': 'ತಾಜಾ ಮೇವು',
    'act.goshala.btn': 'ಗೋದಾನ ಸೇವೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿ',
    'act.goshala.mdl.title': 'ಗೋದಾನ ಸೇವೆ',
    'act.goshala.mdl.desc': 'ನಮ್ಮ ಗೋಶಾಲೆಯನ್ನು ಬೆಂಬಲಿಸಿ ಮತ್ತು ಗೋಮಾತೆಯ ಆಶೀರ್ವಾದವನ್ನು ಪಡೆಯಿರಿ',
    'act.goshala.form.name': 'ಪೂರ್ಣ ಹೆಸರು',
    'act.goshala.form.phone': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    'act.goshala.form.email': 'ಇಮೇಲ್ ವಿಳಾಸ',
    'act.goshala.form.amount': 'ನಿಮ್ಮ ದೇಣಿಗೆ ಮೊತ್ತ',
    'act.goshala.form.submit': 'ದೇಣಿಗೆ ಖಚಿತಪಡಿಸಿ',
    'act.goshala.form.processing': 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    'act.goshala.success': 'ಗೋದಾನ ಸೇವೆಯಲ್ಲಿ ನಿಮ್ಮ ಉದಾತ್ತ ಕೊಡುಗೆಗಾಗಿ ಧನ್ಯವಾದಗಳು! ಗುರು ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳು ಮತ್ತು ಗೋಮಾತೆಯ ಆಶೀರ್ವಾದ ನಿಮ್ಮ ಮೇಲಿರಲಿ.',
    'act.virtual.title': 'ವರ್ಚುವಲ್ ಸೇವೆ',
    'act.virtual.desc': 'ನಮ್ಮ ಲೈವ್ ಸ್ಟ್ರೀಮಿಂಗ್ ಸೇವೆಗಳ ಮೂಲಕ ವಿಶ್ವದ ಎಲ್ಲಿಂದಲಾದರೂ ಪೂಜೆಗಳು ಮತ್ತು ವಿಧಿವಿಧಾನಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ.',
    'act.veda.title': 'ವೇದ ಪಾಠಶಾಲೆ',
    'act.veda.desc': 'ನಮ್ಮ ಪ್ರಾಚೀನ ವೈದಿಕ ಜ್ಞಾನವನ್ನು ಸಂರಕ್ಷಿಸಲು ಮತ್ತು ಪ್ರಚಾರ ಮಾಡಲು ಯುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಶಿಕ್ಷಣ.',
    'act.social.title': 'ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ',
    'act.social.desc': 'ಉಚಿತ ವೈದ್ಯಕೀಯ ಶಿಬಿರಗಳು, ಅಗತ್ಯವಿರುವವರಿಗೆ ಶೈಕ್ಷಣಿಕ ಬೆಂಬಲ ಮತ್ತು ಸಮುದಾಯ ಆಹಾರ ಕಾರ್ಯಕ್ರಮಗಳು.',

    // Activities - Festivals
    'act.festivals.title': 'ಶ್ರೀಮಠದಲ್ಲಿ ನಡೆಯುವ ಉತ್ಸವಗಳು',
    'act.festivals.1': 'ಶ್ರೀ ರಾಘವೇಂದ್ರ ಸ್ವಾಮಿಗಳ ಆರಾಧನಾ ಮಹೋತ್ಸವ',
    'act.festivals.2': 'ಶ್ರೀ ಜಯತೀರ್ಥರು, ಶ್ರೀ ವ್ಯಾಸರಾಜರು, ಶ್ರೀ ವಾದಿರಾಜರ ಆರಾಧನೆಗಳು',
    'act.festivals.3': 'ಧಾರ್ಮಿಕ ಪ್ರವಚನಗಳು, ಧಾತ್ರಿ ಹೋಮ ಮತ್ತು ವಿವಿಧ ಯಜ್ಞ ಯಾಗಗಳು',
    'act.festivals.4': 'ಕಾರ್ತೀಕ ಮಾಸದ ಕೊನೆಯ ಗುರುವಾರ ಲಕ್ಷ ದೀಪೋತ್ಸವ',
    'act.festivals.5': 'ವೈಶಾಖ ಶುದ್ಧ ದಶಮಿಯಂದು ಶ್ರೀನಿವಾಸ ಕಲ್ಯಾಣೋತ್ಸವ',

    // Poojas
    'pooja.schedule': 'ದೈನಂದಿನ ವೇಳಾಪಟ್ಟಿ',
    'pooja.book.title': 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸೇವೆ ಬುಕ್ ಮಾಡಿ',
    'pooja.book.subtitle': 'ಪವಿತ್ರ ಅರ್ಪಣೆಗಳ ಪಟ್ಟಿಯಿಂದ ಆರಿಸಿ',
    'pooja.assistance.title': 'ಸಹಾಯ ಬೇಕೇ?',
    'pooja.assistance.desc': 'ಸೇವಾ ಬುಕಿಂಗ್ ಅಥವಾ ವಿಶೇಷ ವಿನಂತಿಗಳ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಹೊಂದಿದ್ದರೆ, ದಯವಿಟ್ಟು ನಮ್ಮ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    'pooja.contact': 'ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ',

    // Seva Activities
    'seva.title': 'ಶ್ರೀಮಠದಿಂದ ನಡೆಯುವ ಸೇವಾ ಕಾರ್ಯಗಳು',
    'seva.1.title': 'ಕಾಮಧೇನು ಗೋಶಾಲೆ',
    'seva.1.desc': 'ಸುಮಾರು 40ಕ್ಕೂ ಅಧಿಕ ಗೋವುಗಳನ್ನು ಸಂರಕ್ಷಿಸಲಾಗುತ್ತಿದೆ. ಮತ್ತು ರೈತರಿಗೆ ಮತ್ತು ಗೋವುಗಳನ್ನು ಸಾಕುವ ಭರವಸೆ ನೀಡುವ ಅನೇಕರಿಗೆ ಗೋವು ಹಾಗೂ ಕರುಗಳನ್ನು ಅರ್ಹತೆಯ ಆಧಾರದಲ್ಲಿ ಉಚಿತವಾಗಿ ನೀಡಲಾಗುತ್ತಿದೆ.',
    'seva.2.title': 'ರಕ್ತದಾನ ಶಿಬಿರ',
    'seva.2.desc': 'ವರ್ಷದಲ್ಲಿ 2 ಬಾರಿ ಶ್ರೀಮಠದಲ್ಲಿ ಸಾರ್ವಜನಿಕರ ಸಹಕಾರದೊಂದಿಗೆ ರಕ್ತದಾನ ಶಿಬಿರವನ್ನು ಆಯೋಜಿಸಲಾಗುತ್ತಿದೆ. ಟ್ರಸ್ಟ್ ಈ ಮೂಲಕ ಸಾಮಾಜಿಕ ಸೇವಾ ಚಟುವಟಿಕೆಯಲ್ಲಿ ಭಾಗಿಯಾಗಿದೆ.',
    'seva.3.title': 'ವಿದ್ವಾಂಸರಿಗೆ ಗೌರವ',
    'seva.3.desc': 'ಶ್ರೀಮಠದಲ್ಲಿ ಧಾರ್ಮಿಕ ಪ್ರವಚನಗಳನ್ನು ಪ್ರತೀ ತಿಂಗಳು ನಡೆಸಲಾಗುತ್ತಿದೆ. ಒಬ್ಬ ಯುವ ವಿದ್ವಾಂಸರನ್ನು ಆಹ್ವಾನಿಸಿ ಅವರಿಗೆ ಸಂಭಾವನೆ ನೀಡಿ ಗೌರವಿಸಲಾಗುತ್ತಿದೆ. ಮಠದಲ್ಲಿ ಯಾರೇ ವಿದ್ವಾಂಸರು ಬಂದರೂ ಅವರನ್ನು ಗೌರವಿಸಲಾಗುತ್ತಿದೆ.',
    'seva.godana.title': 'ಗೋದಾನ ಸೇವೆಗಳು',
    'seva.godana.desc': 'ಶ್ರೀಮಠದಲ್ಲಿ ಗೋದಾನದ ವ್ಯವಸ್ಥೆ ಇರುತ್ತದೆ ಮತ್ತು ಗೋವುಗಳಿಗೆ ಗೋಗ್ರಾಸ ಸಲ್ಲಿಸಲು ಅವಕಾಶ ಇರುತ್ತದೆ.',
    'seva.godana.madhyama': 'ಗೋದಾನ ಮಧ್ಯಮ ಕಲ್ಪ',
    'seva.godana.uttama': 'ಗೋದಾನ ಉತ್ತಮ ಕಲ್ಪ',
    'seva.godana.salankruta': 'ಗೋದಾನ ಸಾಲಂಕೃತ',
    'seva.godana.hidihullu': 'ಹಿಡಿ ಹುಲ್ಲು ಪುಣ್ಯ ಕೋಟಿ (ಪ್ರತಿ ತಿಂಗಳು)',
    'seva.book': 'ಸೇವೆ ಬುಕ್ ಮಾಡಿ',

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
    'booking.btn.back': 'ಹಿಂದಕ್ಕೆ',
    'booking.btn.payment': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪಾವತಿಸಿ',
    'booking.manual.title': 'ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ',
    'booking.manual.desc': 'ದಯವಿಟ್ಟು ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಬಳಸಿ ಪಾವತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಬುಕಿಂಗ್ ಅನ್ನು ಖಚಿತಪಡಿಸಲು ಟ್ರಾನ್ಸಾಕ್ಷನ್ ಐಡಿ ನಮೂದಿಸಿ.',
    'booking.manual.bank.title': 'ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು',
    'booking.manual.upi.title': 'UPI ಮೂಲಕ ಪಾವತಿಸಿ',
    'booking.manual.field.utr': 'ಟ್ರಾನ್ಸಾಕ್ಷನ್ ಐಡಿ / UTR ಸಂಖ್ಯೆ',
    'booking.manual.field.utr.placeholder': '12-ಅಂಕಿಯ ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    'booking.manual.btn.confirm': 'ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ',
    'booking.manual.success': 'ನಿಮ್ಮ ಬುಕಿಂಗ್ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ! ನಮ್ಮ ತಂಡವು ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
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
