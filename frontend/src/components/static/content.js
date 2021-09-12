import jobsImage from '../images/assets/career.png';
import reportsImage from '../images/assets/reports.png';
import chartsImage from '../images/assets/charts.jpg';
const places = [
  {
    title: 'Get Reports',
    description:
      'Generating, viewing reports, flexible downloading, made easy for the placement cell team',
    imageUrl:  reportsImage,
    time: 1500,
    goTo: "/viewReports"
  },
  {
    title: 'View Charts',
    description: 'Visualizing the number of students placed in each company, year-wise, etc',
    imageUrl:  chartsImage,
    time: 1500,
    goTo: "/visualize"
  },
    {
      title: 'View Jobs',
      description:
        "Viewing the jobs, filtering, applying for them is now made so easy with this app",
      imageUrl: jobsImage,
      time: 1500,
      goTo: "/view"
    }
  ];
  
  export default places;