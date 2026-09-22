import type { Locale } from "./config";

export interface Dictionary {
  siteName: string;
  tagline: string;
  nav: {
    categories: {
      ai_products: string;
      courses: string;
      couple_games: string;
    };
    account: string;
    login: string;
    admin: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    browse: string;
    categoriesTitle: string;
  };
  country: {
    label: string;
  };
  product: {
    buyNow: string;
    priceFrom: string;
    whatYouGet: string;
    instantDownload: string;
  };
  checkout: {
    title: string;
    payWithCard: string;
    payWithInstapay: string;
    instapayInstructions: string;
    instapayHandle: string;
    referenceLabel: string;
    proofLabel: string;
    submitProof: string;
    pendingReview: string;
    needAccount: string;
  };
  account: {
    title: string;
    empty: string;
    download: string;
    pending: string;
    rejected: string;
  };
  auth: {
    title: string;
    emailLabel: string;
    passwordLabel: string;
    signIn: string;
    signUp: string;
    toggleToSignup: string;
    toggleToSignin: string;
    confirmEmailSent: string;
  };
  footer: {
    rights: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    siteName: "Multaqa",
    tagline: "Everything, in one place.",
    nav: {
      categories: {
        ai_products: "AI Digital Products",
        courses: "Courses",
        couple_games: "Couple Games",
      },
      account: "My Purchases",
      login: "Sign in",
      admin: "Admin",
    },
    home: {
      heroTitle: "Everything you need, in one place",
      heroSubtitle:
        "AI-made digital products, practical courses, and games for couples — built for readers across the Arab world.",
      browse: "Browse all products",
      categoriesTitle: "Shop by category",
    },
    country: {
      label: "Shopping for",
    },
    product: {
      buyNow: "Buy now",
      priceFrom: "Price",
      whatYouGet: "What you get",
      instantDownload: "Instant digital download",
    },
    checkout: {
      title: "Checkout",
      payWithCard: "Pay with card (Stripe)",
      payWithInstapay: "Pay with InstaPay",
      instapayInstructions: "Send the exact amount to the InstaPay handle below, then submit your payment reference and a screenshot for review.",
      instapayHandle: "InstaPay handle",
      referenceLabel: "InstaPay reference / transaction ID",
      proofLabel: "Upload payment screenshot",
      submitProof: "Submit for review",
      pendingReview: "Your payment is pending review. You'll get access as soon as it's approved (usually within a few hours).",
      needAccount: "Please sign in first so we can attach this order to your account.",
    },
    account: {
      title: "My Purchases",
      empty: "No purchases yet.",
      download: "Download",
      pending: "Pending review",
      rejected: "Payment not confirmed",
    },
    auth: {
      title: "Sign in",
      emailLabel: "Email address",
      passwordLabel: "Password",
      signIn: "Sign in",
      signUp: "Create account",
      toggleToSignup: "Don't have an account? Sign up",
      toggleToSignin: "Already have an account? Sign in",
      confirmEmailSent: "Account created. Check your email to confirm it, then sign in.",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
  ar: {
    siteName: "ملتقى",
    tagline: "كل شي في مكان واحد.",
    nav: {
      categories: {
        ai_products: "منتجات رقمية بالذكاء الاصطناعي",
        courses: "دورات",
        couple_games: "ألعاب للأزواج",
      },
      account: "مشترياتي",
      login: "تسجيل الدخول",
      admin: "الإدارة",
    },
    home: {
      heroTitle: "كل شي تحتاجه، في مكان واحد",
      heroSubtitle:
        "منتجات رقمية بالذكاء الاصطناعي، دورات عملية، وألعاب للأزواج — مصممة لقراء في الوطن العربي.",
      browse: "تصفح جميع المنتجات",
      categoriesTitle: "تسوق حسب الفئة",
    },
    country: {
      label: "التسوق لـ",
    },
    product: {
      buyNow: "اشترِ الآن",
      priceFrom: "السعر",
      whatYouGet: "ماذا ستحصل عليه",
      instantDownload: "تحميل رقمي فوري",
    },
    checkout: {
      title: "إتمام الشراء",
      payWithCard: "ادفع بالبطاقة (Stripe)",
      payWithInstapay: "ادفع عبر إنستاباي",
      instapayInstructions: "أرسل المبلغ بالضبط إلى حساب إنستاباي أدناه، ثم أرسل رقم العملية وصورة من الإيصال للمراجعة.",
      instapayHandle: "حساب إنستاباي",
      referenceLabel: "رقم عملية إنستاباي",
      proofLabel: "ارفع صورة إثبات الدفع",
      submitProof: "إرسال للمراجعة",
      pendingReview: "طلبك قيد المراجعة. سيتم تفعيل التحميل بعد الموافقة (عادة خلال ساعات قليلة).",
      needAccount: "يرجى تسجيل الدخول أولاً حتى نربط هذا الطلب بحسابك.",
    },
    account: {
      title: "مشترياتي",
      empty: "لا توجد مشتريات بعد.",
      download: "تحميل",
      pending: "قيد المراجعة",
      rejected: "لم يتم تأكيد الدفع",
    },
    auth: {
      title: "تسجيل الدخول",
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      toggleToSignup: "ليس لديك حساب؟ إنشاء حساب",
      toggleToSignin: "لديك حساب بالفعل؟ تسجيل الدخول",
      confirmEmailSent: "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
