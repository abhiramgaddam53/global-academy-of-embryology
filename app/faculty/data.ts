export type Faculty = {
    id: string;
    slug: string;
    name: string;
    designation: string;
    specialization: string;
    experience: string;
    image: string;
    education: string;
    bio: string;
    achievements: string[];
    email: string;
  };
  
  export const faculty: Faculty[] = [
    {
      id: "1",
      slug: "dr-lenin-babu",
      name: "Dr. Lenin Babu",
      designation: "Founder & Senior Clinical Embryologist",
      specialization: "IVF, ART & Embryo Culture",
      experience: "15+ Years",
      image: "/founder.webp",
      education: "PhD Reproductive Biology, MSc Clinical Embryology",
      bio: "Dr. Lenin Babu is a senior clinical embryologist with over 15 years of experience in IVF lab management, embryo culture, micromanipulation techniques, and fertility preservation.",
      achievements: [
        "Trained 500+ embryologists globally",
        "25+ research publications in ART",
        "Keynote speaker at 40+ conferences",
      ],
      email: "lenin@example.com",
    },
    {
      id: "2",
      slug: "dr-ananya-reddy",
      name: "Dr. Ananya Reddy",
      designation: "Senior Clinical Embryologist",
      specialization: "IVF & Cryopreservation",
      experience: "10+ Years",
      image: "/founder.webp",
      education: "PhD Reproductive Sciences, MSc Clinical Embryology",
      bio: "Dr. Ananya Reddy is an expert in vitrification, embryo freezing, and fertility preservation with extensive experience in high-success IVF cycles.",
      achievements: [
        "Handled 3,000+ IVF cycles",
        "Advanced vitrification specialist",
      ],
      email: "ananya@example.com",
    },
    {
      id: "3",
      slug: "dr-rohit-sharma",
      name: "Dr. Rohit Sharma",
      designation: "Junior Clinical Embryologist",
      specialization: "Andrology & Lab Quality Control",
      experience: "4+ Years",
      image: "/founder.webp",
      education: "MSc Clinical Embryology",
      bio: "Dr. Rohit Sharma works in andrology, semen analysis, and embryology lab quality control with hands-on ART experience.",
      achievements: ["Certified Andrology Specialist"],
      email: "rohit@example.com",
    },
  ];
  