// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "post-크래프톤-정글-나만무-회고",
        
          title: "크래프톤 정글 나만무 회고",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/%ED%81%AC%EB%9E%98%ED%94%84%ED%86%A4-%EC%A0%95%EA%B8%80-%EB%82%98%EB%A7%8C%EB%AC%B4-%ED%9A%8C%EA%B3%A0/";
          
        },
      },{id: "post-pintos-fd-table-구조-고르기",
        
          title: "Pintos - fd table 구조 고르기",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Pintos-fd-table-%EA%B5%AC%EC%A1%B0-%EA%B3%A0%EB%A5%B4%EA%B8%B0/";
          
        },
      },{id: "post-proxy-lab-세상은-문자열-파싱으로-돌아간다",
        
          title: "proxy lab - 세상은 문자열 파싱으로 돌아간다",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/proxy-lab-%EC%84%B8%EC%83%81%EC%9D%80-%EB%AC%B8%EC%9E%90%EC%97%B4-%ED%8C%8C%EC%8B%B1%EC%9C%BC%EB%A1%9C-%EB%8F%8C%EC%95%84%EA%B0%84%EB%8B%A4/";
          
        },
      },{id: "post-malloc-lab-삽질은-즐거워",
        
          title: "malloc lab - 삽질은 즐거워",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/malloc-lab-%EC%82%BD%EC%A7%88%EC%9D%80-%EC%A6%90%EA%B1%B0%EC%9B%8C/";
          
        },
      },{id: "post-쉬지않는-cpu-context-switching에-대하여",
        
          title: "쉬지않는 CPU, Context Switching에 대하여",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%EC%89%AC%EC%A7%80%EC%95%8A%EB%8A%94-CPU,-Context-Switching%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC/";
          
        },
      },{id: "post-미니-프로젝트-회고록",
        
          title: "미니 프로젝트 회고록",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%EB%AF%B8%EB%8B%88-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9A%8C%EA%B3%A0%EB%A1%9D/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-alley",
          title: 'Alley',
          description: "AI 상권분석 서비스 Alley",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/example_pdf.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
