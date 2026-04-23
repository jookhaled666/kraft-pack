document.addEventListener('DOMContentLoaded', () => {
    // 0. Custom Cursor Logic
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Using gsap.quickTo for performance and precision
    let xTo = gsap.quickTo(cursor, "x", {duration: 0.2, ease: "power3"});
    let yTo = gsap.quickTo(cursor, "y", {duration: 0.2, ease: "power3"});

    document.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
    });

    const addCursorHover = () => cursor.classList.add('cursor-hover');
    const removeCursorHover = () => cursor.classList.remove('cursor-hover');
    
    // Add hover effect to all interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select, .glass-card, .sector-card, [role="button"], label';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', addCursorHover);
        el.addEventListener('mouseleave', removeCursorHover);
    });

    // Handle dynamically added elements if necessary, but this is a static site mostly.
    document.body.addEventListener('mouseenter', (e) => {
        if (e.target && e.target.matches && e.target.matches(interactiveSelectors)) {
            addCursorHover();
        }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        if (e.target && e.target.matches && e.target.matches(interactiveSelectors)) {
            removeCursorHover();
        }
    }, true);

    // 1. GSAP Preloader Logic
    const preloader = document.getElementById('preloader');
    const cartonLeft = document.querySelector('.carton-door-left');
    const cartonRight = document.querySelector('.carton-door-right');
    const preloaderContent = document.querySelector('.preloader-content') || document.querySelector('.preloader-icon');
    const preloaderImg = document.querySelector('.preloader-icon-img');
    const preloaderBar = document.getElementById('preloaderBar');

    if (preloader) {
        preloader.style.pointerEvents = 'auto';

        // Cartoon bounce-in animation for the custom icon
        if (preloaderImg && typeof gsap !== 'undefined') {
            gsap.from(preloaderImg, { 
                y: -150, 
                rotation: -25, 
                scale: 0.5, 
                opacity: 0, 
                duration: 1.2, 
                ease: "bounce.out" 
            });
        }

        // Fast percentage loading ensuring 100% hits quickly
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 40;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(progressInterval);
                hidePreloader();
            }
            if (preloaderBar) {
                preloaderBar.style.width = Math.min(currentProgress, 100) + '%';
                preloaderBar.style.transition = 'width 0.15s ease-out';
            }
        }, 100);

        const hidePreloader = () => {
            if (preloader.dataset.hidden === 'true') return;
            preloader.dataset.hidden = 'true';

            // Force 100% on load
            if (preloaderBar) {
                preloaderBar.style.width = '100%';
                preloaderBar.style.transition = 'width 0.2s ease-out';
            }
            if(progressInterval) clearInterval(progressInterval);

            try {
                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            preloader.style.display = 'none';
                            document.body.style.overflow = '';
                            
                            // Reveal Header with App-like Feel
                            const header = document.getElementById('main-header');
                            if (header) {
                                gsap.from(header, {
                                    opacity: 0,
                                    y: -20,
                                    duration: 0.8,
                                    ease: 'power4.out',
                                    clearProps: 'all'
                                });
                                header.style.pointerEvents = 'auto';
                            }

                            // Trigger hero entrance
                            if (document.querySelector('.gsap-hero')) {
                                gsap.from('.gsap-hero', {
                                    y: 40,
                                    opacity: 0,
                                    duration: 1,
                                    stagger: 0.15,
                                    ease: 'power4.out'
                                });
                            }
                        }
                    });

                    if (cartonLeft && cartonRight && preloaderContent) {
                        // Cinematic Split Box Open Sequence!
                        tl.to(preloaderContent, { scale: 1.8, opacity: 0, duration: 0.6, ease: "power2.in" }, "+=0.3"); // Zoom icon into the camera
                        tl.to(cartonLeft, { x: "-100%", duration: 1.2, ease: "expo.inOut" }, "-=0.2"); // Open left door
                        tl.to(cartonRight, { x: "100%", duration: 1.2, ease: "expo.inOut" }, "<"); // Open right door at same time
                        tl.to(preloader, { visibility: 'hidden', duration: 0.1 });
                    } else {
                        // Regular fade for inner pages without the carton door effect
                        tl.to(preloader, { opacity: 0, duration: 0.5 }, "+=0.2");
                    }
                } else {
                    preloader.style.opacity = '0';
                    setTimeout(() => { preloader.style.display = 'none'; }, 500);
                    document.body.style.overflow = '';
                }
            } catch (error) {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            }
        };

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
            setTimeout(hidePreloader, 2500); // 2.5s absolute timeout to allow slightly more time for cinematic GSAP
        }

        // Ultimate failsafe
        setTimeout(() => {
            if (preloader) {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            }
        }, 3500);
    }

    // 6. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const currentTheme = localStorage.getItem('theme');
        
        if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-sun';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = themeBtn.querySelector('i');
            const isLight = document.body.classList.contains('light-mode');
            
            if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Animated transition for cursor color filter
            if (typeof gsap !== 'undefined') {
                gsap.to(cursor, {
                    filter: isLight ? 'drop-shadow(0 0 5px rgba(0,0,0,0.2)) invert(1)' : 'drop-shadow(0 0 5px var(--color-kraft-glow))',
                    duration: 0.5
                });
            }
        });
    }

    // 7. Lang Toggle (Manual Dictionary for Precision)
    const langBtn = document.getElementById('lang-toggle');
    const translations = {
        'EN': {
            // Navigation & CTAs
            'nav-home': 'Home',
            'nav-about': 'About Us',
            'nav-products': 'Products',
            'nav-quality': 'Quality & Mfg',
            'nav-contact': 'Contact Us',
            'cta-pricing': 'Request Quote',
            'cta-sample': 'Request Free Sample',
            
            // Hero
            'hero-subtitle': 'Kraft Pack – Your Trusted Partner in Corrugated Cardboard Solutions',
            'hero-desc': 'We provide integrated solutions for manufacturing high-quality corrugated cardboard, designed to meet the needs of various industries in Egypt, focusing on durability, efficiency, and rapid execution.',
            
            // Brief About
            'abt-brief-title': 'Brief Overview',
            'abt-brief-desc': 'Kraft Pack is specialized in corrugated cardboard manufacturing and packaging solutions. We provide practical, customized products that help our clients protect their goods and improve transport and storage efficiency.',
            
            // Sectors
            'sec-title': 'Sectors We Serve',
            'sec-desc': 'Catering to a wide range of industries with innovative and custom packaging solutions',
            'sec-1': 'Fast Moving Consumer Goods (FMCG)',
            'sec-2': 'Food and Beverage Industries',
            'sec-3': 'E-Commerce and Retail',
            'sec-4': 'Various Industrial Sectors',
            'sec-5': 'Agriculture and Fresh Produce',
            
            // Why Us
            'why-title': 'Why Kraft Pack?',
            'why-desc': 'We believe quality and dedication are the foundation of success, delivered in every step.',
            'why-price-t': 'Competitive Pricing',
            'why-price-d': 'We provide packaging solutions that balance high quality and cost-effectiveness, tailored to market needs.',
            'why-flex-t': 'Production Flexibility',
            'why-flex-d': 'Capable of meeting diverse quantities and specifications with custom solutions for every client\'s use case.',
            'why-speed-t': 'Speed of Execution',
            'why-speed-d': 'We commit to delivery deadlines and work efficiently to meet our clients\' needs precisely on time.',
            'why-support-t': 'Continuous Support',
            'why-support-d': 'Our team is always ready to answer your inquiries and provide necessary support for a seamless experience.',
            'why-qual-t': 'Consistent Quality',
            'why-qual-d': 'We use high-quality raw materials with strict quality control at all stages to ensure consistent output for every order.',

            // Statistics & Metrics
            'stats-eyebrow': 'Industrial Excellence',
            'stats-title': 'Our Operations in Numbers',
            'stats-desc': 'A reflection of commitment, quality, and continuous growth at the heart of the Egyptian industry.',
            'stats-1-l': 'Annual Production Units',
            'stats-1-v': '12M+',
            'stats-1-u': '15% growth from last year',
            'stats-2-l': 'Partners in Success',
            'stats-2-v': '450+',
            'stats-2-u': 'Serving major companies in local and international markets.',
            'stats-3-l': 'Unique Products',
            'stats-3-v': '150+',
            'stats-4-l': 'Quality Standards',
            'stats-4-v': '100%',
            'stats-chart-title': 'Sector Distribution',
            'stats-lines': 'Advanced Production Lines',
            'stats-ops': 'Continuous Operation',

            // Industry Marquee
            'ind-title': 'Packaging Solutions for Every Industry',
            'ind-subtitle': 'Innovative and versatile packaging designed to support your business and brand growth.',
            'ind-food': 'Food & Beverage Services',
            'ind-chem': 'Chemical Industries',
            'ind-office': 'Printing & Office Services',
            'ind-biz': 'Business Sector Services',
            'ind-med': 'Medical & Pharmaceutical',
            'ind-ecom': 'E-commerce Solutions',
            'ind-pers': 'Personal Goods',
            'ind-home': 'Household Goods',
            'ind-agri': 'Agriculture & Fresh Produce',
            'ind-parts': 'Industrial Spare Parts',

            'cert-badge': 'Global Compliance',
            'cert-title': 'Certifications & Quality',
            'cert-desc': 'We demonstrate our unwavering commitment to quality, safety, and industrial standards through major international certifications.',

            // Footer
            'foo-about': 'Kraft Pack is your premier partner for corrugated cardboard solutions, driving innovation in packaging since 2016.',
            'foo-links': 'Quick Links',
            'foo-contact': 'Contact Info',
            'foo-address': '10th of Ramadan City, Industrial Zone, Egypt',
            'foo-phone': '+20 123 456 7890',
            'foo-email': 'info@kraftpack-eg.com',
            'foo-rights': '© 2026 Kraft Pack. Built with precision and quality.',

            // About Full Page
            'abt-full-title': 'About Kraft Pack',
            'abt-p1': 'Kraft Pack is a company specialized in manufacturing corrugated cardboard and integrated packaging solutions. We cater to the Egyptian market\'s needs by providing products that combine high quality, durability, and practical design.',
            'abt-p2': 'We rely on carefully selected raw materials and modern manufacturing techniques to ensure products that meet the highest performance standards.',
            'abt-p3': 'We believe packaging is not just a means of protection, but a core element of product success. Therefore, we provide custom solutions that help clients improve logistics, reduce waste, and enhance brand image.',
            'abt-p4': 'Our massive production capabilities allow us to manufacture a wide range of specifications based on the client\'s request, including different flutes, strengths, and dimensions.',
            'abt-p5': 'Through our deep understanding of client needs, we strive to build long-term partnerships based on trust, commitment, and real value.',
            'v-title': 'Vision',
            'v-desc': 'To be the preferred industrial partner for corrugated cardboard solutions in Egypt, by providing high-quality products that support our clients\' growth and enhance their supply chain efficiency.',
            'm-title': 'Mission',
            'm-desc': 'At Kraft Pack, we are committed to manufacturing innovative and reliable packaging solutions using top materials and technologies. We focus on customized products, stable quality, and fast, flexible service to achieve sustainable value for all partners.',

            // Products Page
            'prod-title': 'Our Products',
            'prod-box-t': 'Corrugated Cardboard Boxes',
            'prod-box-d': 'Strong boxes designed to withstand various transport and storage conditions, suitable for diverse industries.',
            'prod-sheet-t': 'Corrugated Cardboard Sheets',
            'prod-sheet-flute': 'Flute Types:',
            'prod-sheet-flute-d': '(Single) B – C – E / (Double) BC – BE',
            'prod-sheet-ply': 'Layers (Ply):',
            'prod-sheet-ply-d': '3 Layers – 5 Layers',
            'prod-sheet-gsm': 'Grammage (GSM):',
            'prod-sheet-gsm-d': 'Varied upon request',
            'prod-print-t': 'Printed Cardboard Boxes',
            'prod-print-d': 'Professional printing solutions that help highlight your brand identity distinctly.',
            'prod-tech-t': 'Printing Technologies',
            'prod-flexo-t': 'Flexo Printing:',
            'prod-flexo-d': 'Ideal for large quantities, characterized by economic cost.',
            'prod-colors': 'Up to 5 colors available to make your visual identity clear and attractive',
            'prod-custom-t': 'Custom Packaging Solutions',
            'prod-custom-d': 'Specially designed solutions according to client needs (sizes, materials, usage) balancing quality and cost for each unique product.',

            // Quality & Manufacturing
            'qual-badge': 'Manufacturing Standards',
            'qual-title': 'Quality is a Lifestyle',
            'qual-desc1': 'At Kraft Pack, quality sits at the core of everything we do. We utilize the finest raw materials to manufacture corrugated cardboard, conducting rigorous tests to deliver exceptional products tailored specifically to each client\'s needs.',
            'qual-desc2': 'We promise that our products feature the ultimate strength and durability to withstand diverse transport and storage conditions, safeguarding your goods and bolstering your supply chain efficiency.',
            'q-feat-1-t': 'Maximum Durability',
            'q-feat-1-d': 'Perfect protection for heavy items',
            'q-feat-2-t': 'Precision Design',
            'q-feat-2-d': 'Laser-sharp cutting & matching',
            'q-feat-3-t': 'Superior Print',
            'q-feat-3-d': 'Vibrant Flexo colors',
            'q-feat-4-t': 'Eco Friendly',
            'q-feat-4-d': '100% Recyclable materials',
            'mfg-badge': 'How We Work',
            'mfg-title': 'Manufacturing Process',
            'mfg-s1-t': '1. Material Selection & Inspection',
            'mfg-s1-d': 'We begin by carefully selecting the finest paper, conducting physical tests for exceptional quality and endurance before production.',
            'mfg-s2-t': '2. Corrugation',
            'mfg-s2-d': 'Paper is corrugated to produce the middle layer (Fluting), granting the cardboard its immense strength and endurance.',
            'mfg-s3-t': '3. Cutting & Shaping',
            'mfg-s3-d': 'Sheets are cut to exact requested dimensions and shaped using advanced Die-Cut molds per the package design.',
            'mfg-s4-t': '4. Printing',
            'mfg-s4-d': 'Flexographic printing is applied according to client branding requirements to ensure a highly professional appearance.',
            'mfg-s5-t': '5. Gluing & Assembly',
            'mfg-s5-d': 'Parts are rapidly assembled with precise high-strength techniques, ensuring ease of use and maximum durability.',
            'mfg-s6-t': '6. Final Quality Inspection',
            'mfg-s6-d': 'A comprehensive structural and visual test is conducted to verify exact compliance with required specifications.',
            'mfg-s7-t': '7. Packing & Dispatch',
            'mfg-s7-d': 'Products are safely packed and prepared to guarantee they arrive to the client in pristine condition.',

            // Contact
            'cont-title': 'Contact Information',
            'cont-email': 'Emails',
            'cont-sales': 'Sales Mobile',
            'cont-cs': 'Customer Service Mobile',
            'cont-fb': 'Facebook Page',
            'cont-form-name': 'Name',
            'cont-form-phone': 'Phone Number',
            'cont-form-msg': 'Message or Inquiry',
            'cont-form-btn': 'Send Message',
            'cont-form-note': 'We will reply back shortly via customer service',
            'pl-name': 'Your full name',
            'pl-phone': 'Mobile number',
            'pl-msg': 'What are the details of your inquiry...',
            'err-name': 'Name is required (at least 3 characters)',
            'err-phone': 'Invalid phone number',
            'err-msg': 'Please write a clear message (at least 10 characters)',
            'msg-success': 'Your message has been sent successfully!',
            'cont-social': 'Social Media',

            // Preloader & Tooltips
            'tip-home': 'Home',
            'tip-about': 'About Us',
            'tip-products': 'Products',
            'tip-quality': 'Quality & Mfg',
            'tip-contact': 'Contact Us',
            'pre-loading': 'Factory Loading...',
            'pre-home': 'Kraft Pack...'
        },
        'AR': {
            // Navigation & CTAs
            'nav-home': 'الرئيسية',
            'nav-about': 'عن الشركة',
            'nav-products': 'المنتجات',
            'nav-quality': 'الجودة والتصنيع',
            'nav-contact': 'تواصل معنا',
            'cta-pricing': 'اطلب عرض سعر',
            'cta-sample': 'اطلب عينة مجانية',
            
            // Hero
            'hero-subtitle': 'كرافت باك – شريكك الموثوق في حلول الكرتون المضلع',
            'hero-desc': 'نقدم حلول متكاملة لتصنيع الكرتون المضلع بجودة عالية، مصممة لتلبية احتياجات مختلف الصناعات داخل مصر، مع التركيز على المتانة، الكفاءة، وسرعة التنفيذ.',
            
            // Brief About
            'abt-brief-title': 'نبذة مختصرة',
            'abt-brief-desc': 'كرافت باك هي شركة متخصصة في تصنيع الكرتون المضلع وحلول التغليف، حيث نقدم منتجات عملية ومخصصة تساعد عملاءنا على حماية منتجاتهم وتحسين كفاءة النقل والتخزين.',
            
            // Sectors
            'sec-title': 'القطاعات التي نخدمها',
            'sec-desc': 'نلبي احتياجات مجموعة واسعة من الصناعات بحلول تغليف مبتكرة ومخصصة',
            'sec-1': 'السلع الاستهلاكية (FMCG)',
            'sec-2': 'الصناعات الغذائية والمشروبات',
            'sec-3': 'التجارة الإلكترونية والتجزئة',
            'sec-4': 'الصناعات المختلفة',
            'sec-5': 'الزراعة والمنتجات الطازجة',
            
            // Why Us
            'why-title': 'لماذا كرافت باك ؟',
            'why-desc': 'نحن نؤمن بأن الجودة والتفاني هما أساس النجاح، وهذا ما نقدمه في كل خطوة.',
            'why-price-t': 'أسعار تنافسية',
            'why-price-d': 'نقدم حلول تغليف تحقق التوازن بين الجودة والتكلفة، بما يتناسب مع احتياجات السوق ومتطلبات عملائنا.',
            'why-flex-t': 'مرونة في الإنتاج',
            'why-flex-d': 'نستطيع تلبية مختلف الكميات والمواصفات، مع توفير حلول مخصصة لكل عميل حسب طبيعة استخدامه.',
            'why-speed-t': 'سرعة في التنفيذ والتوريد',
            'why-speed-d': 'نلتزم بمواعيد التسليم ونعمل بكفاءة لضمان تلبية احتياجات عملائنا في الوقت المناسب.',
            'why-support-t': 'دعم وتواصل مستمر',
            'why-support-d': 'فريقنا جاهز للرد على استفساراتك وتقديم الدعم اللازم لضمان تجربة تعاون سلسة وفعالة.',
            'why-qual-t': 'جودة ثابتة',
            'why-qual-d': 'نحرص على استخدام خامات عالية الجودة مع رقابة دقيقة في جميع مراحل الإنتاج لضمان تقديم منتج بمستوى ثابت في كل طلب.',

            // Statistics & Metrics
            'stats-eyebrow': 'التميز الصناعي',
            'stats-title': 'إنجازاتنا بالأرقام',
            'stats-desc': 'تجسيد للالتزام، الجودة، والنمو المستمر في قلب الصناعة المصرية.',
            'stats-1-l': 'إجمالي الإنتاج السنوي',
            'stats-1-v': '12M+',
            'stats-1-u': 'نمو بنسبة 15% عن العام الماضي',
            'stats-2-l': 'شركاء النجاح',
            'stats-2-v': '450+',
            'stats-2-u': 'خدمة كبرى الشركات في السوق المحلي والدولي.',
            'stats-3-l': 'نوع من المنتجات',
            'stats-3-v': '150+',
            'stats-4-l': 'معايير الجودة',
            'stats-4-v': '100%',
            'stats-chart-title': 'توزيع القطاعات',
            'stats-lines': 'خطوط إنتاج متطورة',
            'stats-ops': 'تشغيل متواصل',

            // Industry Marquee
            'ind-title': 'حلول التغليف لكل صناعة',
            'ind-subtitle': 'تغليف مبتكر ومتعدد الاستخدامات مصمم لدعم عملك ونمو علامتك التجارية.',
            'ind-food': 'خدمات الطعام والشراب',
            'ind-chem': 'الصناعات الكيميائية',
            'ind-office': 'خدمات الطباعة والمكاتب',
            'ind-biz': 'خدمات قطاع الأعمال',
            'ind-med': 'الخدمات الطبية والدوائية',
            'ind-ecom': 'التجارة الإلكترونية',
            'ind-pers': 'السلع الشخصية',
            'ind-home': 'السلع المنزلية',
            'ind-agri': 'الزراعة والمنتجات الطازجة',
            'ind-parts': 'قطع الغيار الصناعية',

            'cert-badge': 'الالتزام بالمعايير',
            'cert-title': 'شهادات الاعتماد والجودة',
            'cert-desc': 'نظهر التزامنا الراسخ بالجودة والسلامة والمعايير الصناعية من خلال اعتمادات كبرى الهيئات الدولية.',

            // Footer
            'foo-about': 'كرافت باك هي شريكك الأول لحلول الكرتون المضلع، نقود الابتكار في مجال التغليف منذ عام 2016.',
            'foo-links': 'روابط سريعة',
            'foo-contact': 'معلومات التواصل',
            'foo-address': 'مدينة العاشر من رمضان، المنطقة الصناعية، مصر',
            'foo-phone': '+20 123 456 7890',
            'foo-email': 'info@kraftpack-eg.com',
            'foo-rights': '© 2026 كرافت باك. صنعت بكل دقة وجودة.',

            // About Full Page
            'abt-full-title': 'عن Kraft Pack',
            'abt-p1': 'كرافت باك هي شركة متخصصة في تصنيع الكرتون المضلع وحلول التغليف المتكاملة، حيث نعمل على تلبية احتياجات السوق المصري من خلال تقديم منتجات تجمع بين الجودة العالية، المتانة، والتصميم العملي.',
            'abt-p2': 'نعتمد في انتاجنا على استخدام خامات مختارة بعناية، وتقنيات تصنيع حديثة، لضمان تقديم منتجات تلبي أعلى معايير الأداء والجودة.',
            'abt-p3': 'نؤمن بأن التغليف ليس مجرد وسيلة حماية، بل عنصر أساسي في نجاح المنتج، لذلك نحرص على تقديم حلول مخصصة تساعد عملاءنا على تحسين كفاءة النقل والتخزين، وتقليل الفاقد، وتعزيز صورة علامتهم التجارية في السوق.',
            'abt-p4': 'تمكننا قدراتنا الإنتاجية من تصنيع مجموعة واسعة من المواصفات حسب طلب العميل، بما في ذلك اختلاف أنواع الفلوت، درجات التحمل، والمقاسات.',
            'abt-p5': 'من خلال فهمنا العميق لاحتياجات العملاء، نسعى لبناء شراكات طويلة الأمد قائمة على الثقة، الالتزام، وتقديم قيمة حقيقية.',
            'v-title': '🎯 الرؤية (Vision)',
            'v-desc': 'أن نكون الشريك الصناعي المفضل في مجال حلول الكرتون المضلع في مصر، من خلال تقديم منتجات عالية الجودة تدعم نمو عملائنا وتعزز كفاءة سلاسل الإمداد لديهم.',
            'm-title': '🎯 الرسالة (Mission)',
            'm-desc': 'نلتزم في كرافت باك بتصنيع وتقديم حلول تغليف مبتكرة وموثوقة، باستخدام أفضل الخامات وأحدث تقنيات الإنتاج، مع التركيز على تلبية احتياجات عملائنا من خلال منتجات مخصصة، جودة مستقرة، وخدمة تعتمد على السرعة والمرونة، بما يحقق قيمة مستدامة لجميع شركائنا.',

            // Products Page
            'prod-title': 'المنتجات',
            'prod-box-t': 'علب كرتون مضلع',
            'prod-box-d': 'علب قوية ومصممة لتحمل ظروف النقل والتخزين المختلفة، مناسبة لمختلف الصناعات.',
            'prod-sheet-t': 'ألوح الكرتون المضلع (Sheets)',
            'prod-sheet-flute': 'أنواع الفلوت (Flute):',
            'prod-sheet-flute-d': '(سنجل) B – C – E \\ (دبل) BC – BE',
            'prod-sheet-ply': 'عدد الطبقات (Ply):',
            'prod-sheet-ply-d': '3 طبقات – 5 طبقات',
            'prod-sheet-gsm': 'جرامات (GSM):',
            'prod-sheet-gsm-d': 'مختلفة حسب الطلب',
            'prod-print-t': 'علب كرتون مطبوعة',
            'prod-print-d': 'حلول طباعة احترافية تساعد على إبراز هوية علامتك التجارية بشكل مميز.',
            'prod-tech-t': 'تقنيات الطباعة',
            'prod-flexo-t': 'طباعة فلكسو (Flexo):',
            'prod-flexo-d': 'مناسبة للكميات الكبيرة وتتميز بتكلفة اقتصادية.',
            'prod-colors': 'إمكانية الطباعة حتى 5 ألوان لإبراز الهوية البصرية بشكل واضح وجذاب',
            'prod-custom-t': 'حلول تغليف مخصصة',
            'prod-custom-d': 'نقدم حلول مصممة خصيصًا حسب احتياجات العميل من حيث المقاسات، الخامات، والاستخدام لتحقيق التوازن بين الجودة والتكلفة، بما يتناسب مع طبيعة كل منتج.',

            // Quality & Manufacturing
            'qual-badge': 'معايير التصنيع',
            'qual-title': 'الجودة أسلوب حياة',
            'qual-desc1': 'في كرافت باك، نضع الجودة في صميم كل ما نقوم به. نحرص على استخدام أجود الخامات في تصنيع الكرتون المضلع، مع إجراء فحوصات الجودة لنقدم منتجات استثنائية، مصممة خصيصًا لتناسب احتياجات كل عميل.',
            'qual-desc2': 'نضمن أن تتمتع منتجاتنا بالقوة والمتانة الكافية لتحمل ظروف النقل والتخزين المختلفة، مما يحافظ على سلامة بضائعك ويعزز كفاءة سلسلة الإمداد لديك.',
            'q-feat-1-t': 'متانة قصوى',
            'q-feat-1-d': 'حماية مثالية للمنتجات الثقيلة',
            'q-feat-2-t': 'دقة التصميم',
            'q-feat-2-d': 'قص وتشكيل بدقة لتطابق مثالي',
            'q-feat-3-t': 'طباعة فائقة',
            'q-feat-3-d': 'ألوان زاهية وواضحة بتقنية الفلكسو',
            'q-feat-4-t': 'صديقة للبيئة',
            'q-feat-4-d': 'خامات قابلة لإعادة التدوير',
            'mfg-badge': 'كيف نعمل',
            'mfg-title': 'مراحل التصنيع',
            'mfg-s1-t': '1- اختيار وفحص الخامات',
            'mfg-s1-d': 'نبدأ باختيار أجود أنواع الورق بعناية، مع إجراء فحوصات لضمان الجودة والمتانة قبل بدء عملية الإنتاج.',
            'mfg-s2-t': '2- تمويج الورق',
            'mfg-s2-d': 'يتم تمويج الورق لإنتاج الطبقة الوسطى (Fluting)، والتي تمنح الكرتون القوة والقدرة على التحمل.',
            'mfg-s3-t': '3- التقطيع والتشكيل',
            'mfg-s3-d': 'يتم تقطيع الألواح حسب المقاسات المطلوبة، مع تشكيلها وفق تصميم العبوة المطلوبة (Die-Cut).',
            'mfg-s4-t': '4- الطباعة',
            'mfg-s4-d': 'يتم الطباعة (Flexo) بألوان زاهية حسب متطلبات العميل، لضمان مظهر احترافي يعكس الهوية البصرية.',
            'mfg-s5-t': '5- اللصق والتجميع',
            'mfg-s5-d': 'تجميع الأجزاء ولصقها بدقة باستخدام تقنيات ومواد لاصقة عالية الجودة لضمان متانة العلبة وتماسكها.',
            'mfg-s6-t': '6- الفحص النهائي للجودة',
            'mfg-s6-d': 'نقوم بإجراء فحص شامل وصارم للتأكد من مطابقة المنتج النهائي للمواصفات القياسية والمطلوبة.',
            'mfg-s7-t': '7- التعبئة والتوريد',
            'mfg-s7-d': 'يتم تجهيز المنتجات وتغليفها بشكل آمن على منصات نقالة (بالتات) لضمان وصولها بحالة ممتازة للعميل.',

            // Contact
            'cont-title': 'تواصل معنا',
            'cont-email': 'البريد الإلكتروني',
            'cont-sales': 'رقم المبيعات',
            'cont-cs': 'رقم خدمة العملاء',
            'cont-fb': 'صفحة فيسبوك',
            'cont-form-name': 'الاسم',
            'cont-form-phone': 'رقم الهاتف',
            'cont-form-msg': 'الرسالة أو الاستفسار',
            'cont-form-btn': 'إرسال الرسالة',
            'cont-form-note': 'سنقوم بالرد عليك في أقرب وقت عبر خدمة العملاء',
            'pl-name': 'اسمك الكريم',
            'pl-phone': 'رقم الموبايل للتواصل',
            'pl-msg': 'ما هي تفاصيل طلبك أو استفسارك...',
            'err-name': 'الاسم مطلوب (3 أحرف على الأقل)',
            'err-phone': 'رقم هاتف غير صالح',
            'err-msg': 'يرجى كتابة رسالة واضحة (10 أحرف على الأقل)',
            'msg-success': 'تم إرسال رسالتك بنجاح!',
            'cont-social': 'منصات التواصل',

            // Preloader & Tooltips
            'tip-home': 'الرئيسية',
            'tip-about': 'عن الشركة',
            'tip-products': 'المنتجات',
            'tip-quality': 'الجودة والتصنيع',
            'tip-contact': 'تواصل معنا',
            'pre-loading': 'تجهيز المصنع...',
            'pre-home': 'كرافت باك...'
        }
    };

    let currentLang = localStorage.getItem('lang') || 'AR';
    
    function updateLanguage(lang) {
        document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang === 'AR' ? 'ar' : 'en';
        langBtn.innerText = lang === 'AR' ? 'EN' : 'AR';
        
        // Update elements with data-t (innerHTML)
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-p]').forEach(el => {
            const key = el.getAttribute('data-p');
            if (translations[lang][key]) {
                el.setAttribute('placeholder', translations[lang][key]);
            }
        });

        // Update tooltips with data-tt (getAttribute)
        document.querySelectorAll('[data-tt]').forEach(el => {
            const key = el.getAttribute('data-tt');
            if (translations[lang][key]) {
                el.setAttribute('data-tooltip', translations[lang][key]);
            }
        });

        localStorage.setItem('lang', lang);
    }

    // Initialize Language
    if (currentLang === 'EN') updateLanguage('EN');

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'AR' ? 'EN' : 'AR';
            updateLanguage(currentLang);
        });
    }

    // 3. GSAP Scroller animations as before...
    gsap.registerPlugin(ScrollTrigger);
    // [Rest of counters and reveal logic...]
    // Reveal on scroll
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // 4. Global Counter Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (isNaN(target)) return;
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 90%',
                onEnter: () => {
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const steps = 60;
                    const increment = target / steps;
                    const stepTime = duration / steps;

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count).toLocaleString();
                            setTimeout(updateCount, stepTime);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCount();
                }
            });
        });
    }

    // 5. Statistics Sections
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {

        // Chart.js Initialization
        const ctx = document.getElementById('productionChart');
        if (ctx && typeof Chart !== 'undefined') {
            const productionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['FMCG', 'Food', 'E-commerce', 'Industrial', 'Agriculture'],
                    datasets: [{
                        data: [35, 25, 20, 10, 10],
                        backgroundColor: [
                            'rgba(217, 119, 6, 0.9)',  // Kraft-600
                            'rgba(245, 158, 11, 0.7)', // Kraft-500
                            'rgba(251, 191, 36, 0.5)', // Kraft-400
                            'rgba(255, 255, 255, 0.15)', // White subtle
                            'rgba(255, 255, 255, 0.05)'  // White ghost
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        hoverOffset: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#9ca3af',
                                font: {
                                    family: 'Cairo',
                                    size: 12
                                },
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    },
                    animation: {
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default') {
                                delay = context.dataIndex * 300;
                            }
                            return delay;
                        }
                    }
                }
            });

            // Trigger chart animation on scroll
            ScrollTrigger.create({
                trigger: ctx,
                start: 'top 80%',
                onEnter: () => {
                    productionChart.update();
                }
            });
        }
    }

    // Stats Section GSAP
    if (document.querySelector('#stats-section')) {
        const tlStats = gsap.timeline({
            scrollTrigger: {
                trigger: '#stats-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        tlStats.from('.stats-reveal .glass-card', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
    }

    // Custom GSAP Animations for Index Sections
    if (document.querySelector('#sectors-section')) {
        const tlSectors = gsap.timeline({
            scrollTrigger: {
                trigger: '#sectors-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        tlSectors.from('#sectors-section .section-header-reveal', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
        })
        .from('.sector-card', {
            y: 80,
            scale: 0.9,
            rotationX: -15, // Cinematic 3D entrance
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            transformOrigin: "center bottom",
            ease: 'back.out(1.5)',
            clearProps: 'all'
        }, "-=0.8");
    }

    if (document.querySelector('#why-section')) {
        const tlWhy = gsap.timeline({
            scrollTrigger: {
                trigger: '#why-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        tlWhy.from('#why-section .section-header-reveal', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
        })
        .from('.why-card', {
            y: 80,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            stagger: 0.15,
            ease: 'power4.out',
            clearProps: 'all'
        }, "-=0.8");
    }

    if (document.querySelector('#testimonials-section')) {
        const tlTestim = gsap.timeline({
            scrollTrigger: {
                trigger: '#testimonials-section',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        tlTestim.from('#testimonials-section .section-header-reveal', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
        })
        .from('.testimonial-card', {
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.2)',
            clearProps: 'all'
        }, "-=0.8");
    }

    // 5. Accordion Logic
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.accordion-icon');
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            accordionButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherBtn.nextElementSibling.classList.remove('open');
                    otherBtn.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current
            btn.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('open');
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // 8. Form Validation Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate on blur (when leaving the field)
            input.addEventListener('blur', () => {
                validateInput(input);
            });

            // Validate on input ONLY if it has an error (to remove the error instantly) or if it becomes valid
            input.addEventListener('input', () => {
                if (input.classList.contains('input-error')) {
                    validateInput(input);
                } else if (input.checkValidity() && input.value.trim() !== '') {
                    validateInput(input); // Mark as success
                }
            });
        });

        function validateInput(input) {
            const errorSpan = input.closest('.flex-col').querySelector('.error-message');
            const validIcon = input.parentNode.querySelector('.valid-icon');
            const invalidIcon = input.parentNode.querySelector('.invalid-icon');

            if (!input.checkValidity() || input.value.trim() === '') {
                input.classList.add('input-error', 'border-red-500');
                input.classList.remove('input-success', 'border-green-500', 'focus:border-kraft-500');
                
                if (validIcon) validIcon.classList.add('hidden');
                if (invalidIcon) invalidIcon.classList.remove('hidden');

                if (errorSpan) {
                    errorSpan.classList.remove('hidden');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(errorSpan, { opacity: 0, x: -5 }, { opacity: 1, x: 0, duration: 0.2 });
                    }
                }
                return false;
            } else {
                input.classList.remove('input-error', 'border-red-500');
                input.classList.add('input-success', 'border-green-500');
                
                if (invalidIcon) invalidIcon.classList.add('hidden');
                if (validIcon) {
                    validIcon.classList.remove('hidden');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(validIcon, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out' });
                    }
                }

                if (errorSpan) {
                    errorSpan.classList.add('hidden');
                }
                return true;
            }
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                const btn = document.getElementById('contactSubmit');
                const successMsg = document.getElementById('formSuccessMsg');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    contactForm.reset();
                    inputs.forEach(i => {
                        i.classList.remove('input-success', 'border-green-500');
                        const vIcon = i.parentNode.querySelector('.valid-icon');
                        if (vIcon) vIcon.classList.add('hidden');
                    });
                    successMsg.classList.remove('hidden');
                    
                    // Simple GSAP bounce for success message
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(successMsg, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' });
                    }
                    
                    setTimeout(() => successMsg.classList.add('hidden'), 5000);
                }, 1500);
            }
        });
    }

    // 9. Certifications Carousel Logic (Infinite Autoplay)
    const initCertCarousel = () => {
        const track = document.getElementById('cert-track');
        const nextBtn = document.getElementById('cert-next');
        const prevBtn = document.getElementById('cert-prev');
        const pagination = document.getElementById('cert-pagination');
        
        if (!track || !nextBtn || !prevBtn) return;

        const slides = Array.from(track.children);
        let currentIndex = 0;
        let autoplayInterval;
        const autoplayDelay = 3000; // 3 seconds

        const getSlidesPerView = () => {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        };

        const updateCarousel = () => {
            const spv = getSlidesPerView();
            const maxIndex = Math.max(0, slides.length - spv);
            
            // Adjust index if out of bounds (can happen on resize)
            if (currentIndex > maxIndex && maxIndex >= 0) currentIndex = maxIndex;
            
            const slideWidth = slides[0].offsetWidth;
            const offset = currentIndex * slideWidth;
            
            const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
            if (isRTL) {
                track.style.transform = `translateX(${offset}px)`;
            } else {
                track.style.transform = `translateX(-${offset}px)`;
            }

            // Update dots
            if (pagination) {
                const dots = pagination.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.style.width = index === currentIndex ? '24px' : '8px';
                    dot.style.backgroundColor = index === currentIndex ? '#D97706' : 'rgba(255,255,255,0.2)';
                    dot.style.opacity = index === currentIndex ? '1' : '0.5';
                });
            }
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                const spv = getSlidesPerView();
                if (currentIndex < slides.length - spv) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Seamless loop back
                }
                updateCarousel();
            }, autoplayDelay);
        };

        const stopAutoplay = () => {
            if (autoplayInterval) clearInterval(autoplayInterval);
        };

        const createDots = () => {
            if (!pagination) return;
            pagination.innerHTML = '';
            const spv = getSlidesPerView();
            const dotCount = Math.max(0, slides.length - spv + 1);
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot h-1.5 rounded-full transition-all duration-500 cursor-pointer';
                dot.style.width = '8px';
                dot.style.backgroundColor = 'rgba(255,255,255,0.2)';
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                    startAutoplay(); // Reset timer
                });
                pagination.appendChild(dot);
            }
        };

        nextBtn.addEventListener('click', () => {
            const spv = getSlidesPerView();
            if (currentIndex < slides.length - spv) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
            startAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            const spv = getSlidesPerView();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = Math.max(0, slides.length - spv);
            }
            updateCarousel();
            startAutoplay();
        });

        // Pause on hover
        const container = track.closest('.carousel-container');
        if (container) {
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }

        createDots();
        updateCarousel();
        startAutoplay();

        window.addEventListener('resize', () => {
            createDots();
            updateCarousel();
        });
    };

    // 10. Mobile Menu Logic
    const menuTrigger = document.getElementById('mobile-menu-trigger');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuClose = document.getElementById('close-mobile-menu');
    const menuLinks = menuOverlay ? menuOverlay.querySelectorAll('a') : [];

    if (menuTrigger && menuOverlay && menuClose) {
        menuTrigger.addEventListener('click', () => {
            menuOverlay.classList.remove('pointer-events-none');
            menuOverlay.classList.add('opacity-100');
        });

        const closeMenu = () => {
            menuOverlay.classList.add('pointer-events-none');
            menuOverlay.classList.remove('opacity-100');
        };

        menuClose.addEventListener('click', closeMenu);
        menuLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    initCertCarousel();
});
