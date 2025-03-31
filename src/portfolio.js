const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://playatanu.github.io',
  title: 'AD.',
}

const about = {
  // all the properties are optional - can be left empty or deleted
  name: 'Atanu Debnath',
  role: 'Computer Vision Engineer',
  description:
    'Hi there! I’m Atanu Debnath, a computer science student interested in artificial intelligence. My academic journey focuses on learning to build intelligent systems that can analyze and interpret visual data. I am passionate about applying deep learning techniques, particularly in the field of computer vision.',
  resume: 'Atanu_Debnath_Resume.pdf',
  social: {
    linkedin: 'https://linkedin.com/in/playatanu/',
    github: 'https://github.com/playatanu',
  },
}

const projects = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: 'Image Similarity Search',
    description:
      'Image search system using ResNet50 for feature extraction, FAISS for fast search, and SQLite for metadata storage.',
    stack: ['ResNet50', 'FAISS', 'SQLite'],
    sourceCode: 'https://github.com',
    youtubeVideo: 'https://youtu.be/DWbKI3PEZNs',
  },
  {
    name: 'Virtual Hair Colour Try on System',
    description:
      'A U-Net-based system for virtual hair color transformation, deployed on a scalable web app using Flask and Docker.',
    stack: ['U-Net', 'Flask', 'Docker'],
    sourceCode: 'https://github.com/playatanu/hair-color-try-on',
    livePreview: 'https://hair-colour-82219561125.asia-south1.run.app/',
    youtubeVideo: 'https://youtu.be/sNUbNRr4ztg',
  },
  {
    name: 'Blood Cell Detection',
    description:
      'A Faster R-CNN-based system for detecting and classifying blood cells (RBC, WBC, Platelets) in microscopic images.',
    stack: ['Faster R-CNN'],
    sourceCode: 'https://github.com',
    youtubeVideo: 'https://github.com',
  },

  {
    name: 'Smart Parking System',
    description:
      'Real-time vehicle detection and license plate recognition system with timestamp logging using YOLO and OCR technologies.',
    stack: ['YOLO', 'OCR'],
    sourceCode: 'https://github.com/playatanu/smart-car-parking',
    youtubeVideo: 'https://youtu.be/FyBBYTRnlsc',
  },

  {
    name: 'Android Based Object Detection System',
    description:
      'Object detection system for visually impaired users, enabling real-time identification of objects and obstacles with TTS alerts.',
    stack: ['YOLO', 'Flutter'],
    sourceCode: 'https://github.com/playatanu/object-detection-app',
    youtubeVideo: 'https://youtu.be/nUj9VhqMpEA',
  },

  {
    name: 'Face Recognition System',
    description:
      'A FaceNet-powered system for accurate face identification, integrated into an interactive web application using Streamlit.',
    stack: ['FaceNet', 'Streamlit'],
    sourceCode: 'https://github.com/playatanu/face-recognition-app',
    youtubeVideo: 'https://youtu.be/ay6WTBdphlc',
  },
]

const skills = [
  // skills can be added or removed
  // if there are no skills, Skills section won't show up
  'Python',
  'C / C++',
  'OpenCV',
  'PyTorch',
  'Tensorflow',
  'Git',
]

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'playatanu@gmail.com',
}

export { header, about, projects, skills, contact }
