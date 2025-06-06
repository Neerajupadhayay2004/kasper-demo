import React, { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { FaMapMarkerAlt, FaClock, FaGraduationCap, FaCalendarAlt, FaSun, FaMoon } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// Import all images - adjust these paths according to your actual file structure
import logo from './assets/logo.png';
import doctorImage from './assets/doctor.png';
import doctorProfile from './assets/doctor-profile.jpg';
import mapImage from './assets/map.jpg';
import calendarImage from './assets/calendar.png';
import stethoscopeImage from './assets/stethoscope.png';
import patientImage from './assets/patient.jpg';
import backPain from './assets/back-pain.jpg';
import wristPain from './assets/wrist-pain.jpg';
import slippedDisc from './assets/slipped-disc.jpg';
import neckPain from './assets/neck-pain.jpg';
import anklePain from './assets/ankle-pain.jpg';
import headache from './assets/headache.jpg';
import kneePain from './assets/knee-pain.jpg';
import sportInjuries from './assets/sport-injuries.jpg';

// Fix for leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Image object
const images = {
  logo,
  doctorImage,
  doctorProfile,
  mapImage,
  calendarImage,
  stethoscopeImage,
  patientImage,
  backPain,
  wristPain,
  slippedDisc,
  neckPain,
  anklePain,
  headache,
  kneePain,
  sportInjuries,
};

// Theme definitions
const lightTheme = {
  colors: {
    primary: '#059669',
    secondary: '#3B82F6',
    background: '#ffffff',
    text: '#333333',
    textLight: '#666666',
    headerBg: '#ffffff',
    cardBg: '#ffffff',
    footerBg: '#0f172a',
    footerText: '#cbd5e1',
  },
  shadows: {
    small: '0 2px 15px rgba(0, 0, 0, 0.1)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
};

const darkTheme = {
  colors: {
    primary: '#10b981',
    secondary: '#60a5fa',
    background: '#1e293b',
    text: '#f8fafc',
    textLight: '#94a3b8',
    headerBg: '#1e293b',
    cardBg: '#334155',
    footerBg: '#0f172a',
    footerText: '#cbd5e1',
  },
  shadows: {
    small: '0 2px 15px rgba(0, 0, 0, 0.3)',
    medium: '0 5px 15px rgba(0, 0, 0, 0.3)',
    large: '0 10px 25px rgba(0, 0, 0, 0.3)',
  },
};

// Global styles
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 0.3s, color 0.3s;
  }

  body {
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  .leaflet-container {
    height: 300px;
    width: 100%;
    border-radius: 8px;
  }
`;

// Star rating component
const Star = ({ filled }) => (
  <span style={{ color: filled ? '#f59e0b' : '#cbd5e1' }}>★</span>
);

// PatientName component
const PatientName = ({ children }) => (
  <p style={{ fontStyle: 'italic', margin: '0.5rem 0' }}>{children}</p>
);

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.headerBg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
`;

const LoginButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}10`};
  }
`;

const SignupButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}90`};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

// Main Content Styles
const Main = styled.main`
  flex: 1;
`;

// Hero Section Styles
const HeroSection = styled.section`
  background: linear-gradient(135deg, #f0f9f8 0%, #e6f3f1 100%);
  padding: 4rem 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;

  ${({ theme }) => theme === darkTheme && `
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  `}

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    gap: 2rem;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const BlueText = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.8rem 1.8rem;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px ${({ theme }) => `${theme.colors.primary}20`};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}90;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px ${({ theme }) => `${theme.colors.primary}30`};
  }
`;

const HeroImage = styled.img`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }
`;

// Doctor Section Styles
const DoctorSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const DoctorContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const DoctorImage = styled.img`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const DoctorDetails = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 600px;
`;

const DoctorName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const DoctorSpecialty = styled.h3`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const DoctorQualification = styled.h5`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DoctorExperience = styled.h5`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DoctorBio = styled.p`
  margin: 1.5rem 0;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme === lightTheme ? '#f9fafb' : '#1e293b'};

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const StyledCarousel = styled(Carousel)`
  max-width: 800px;
  margin: 0 auto;

  .carousel .slide {
    background: transparent;
  }

  .control-arrow {
    background-color: ${({ theme }) => theme.colors.primary} !important;
    opacity: 1 !important;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .control-prev {
    left: 10px;
  }

  .control-next {
    right: 10px;
  }
`;

const TestimonialCard = styled.div`
  padding: 2rem;
  text-align: center;
`;

const TestimonialContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.7;
`;

const TestimonialAuthor = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Rating = styled.div`
  margin-top: 1rem;
  font-size: 1.5rem;
`;

// Services Section Styles
const ServicesSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme === lightTheme ? '#f9fafb' : '#1e293b'};

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
  line-height: 1.7;
`;

const ServicesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ServiceTitle = styled.p`
  padding: 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const SeeMoreButton = styled(PrimaryButton)`
  display: block;
  margin: 3rem auto 0;
  padding: 0.8rem 2rem;
`;

// Patient Resources Section Styles
const PatientResourcesSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const ResourcesHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const ResourcesTitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ResourcesSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ResourcesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const ResourceCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const ResourceTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ResourceTitleWithIcon = styled(ResourceTitle)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ResourceDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
`;

const PatientImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.primary};
`;

const FaqList = styled.ul`
  list-style: none;
  width: 100%;
  margin-bottom: 2rem;
  text-align: left;
`;

const FaqItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.textLight}20;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  line-height: 1.5;

  &:last-child {
    border-bottom: none;
  }
`;

const CalendarImage = styled.img`
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin: 1rem 0;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin: 1rem 0;
`;

const BlogExcerpt = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
`;

const ResourceButton = styled.a`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: auto;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const ResourceContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ResourceMeta = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ResourceDate = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const ResourceAuthor = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const ResourceCategory = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  display: inline-block;
`;

const TestimonialQuote = styled.blockquote`
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  margin: 1rem 0;
  text-align: left;
  width: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
`;

const VideoThumbnail = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const DownloadLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-top: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

// Contact Section Styles
const ContactSection = styled.section`
  padding: 5rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const FormTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const TabButton = styled.button`
  padding: 0.8rem 2rem;
  border: none;
  background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.cardBg};
  color: ${({ theme, active }) => active ? 'white' : theme.colors.text};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.cardBg};
    transform: translateY(-2px);
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.cardBg};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
  padding: 0.8rem;
  border: 1px solid ${({ theme, error }) => error ? '#ef4444' : theme.colors.textLight}20;
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${({ theme, error }) => error ? '#ef4444' : theme.colors.textLight}20;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
`;

const MapWrapper = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  text-align: center;
`;

const MapAddress = styled.p`
  margin: 1rem 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MapHours = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const MapZoomControl = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const RangeInput = styled.input`
  width: 100px;
`;

// Footer Styles
const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.footerBg};
  color: ${({ theme }) => theme.colors.footerText};
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: white;
`;

const FooterText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const FooterLink = styled.a`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.footerText};
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
`;

const NewsletterButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}90;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.footerBg};
  color: ${({ theme }) => theme.colors.footerText};
  border-top: 1px solid ${({ theme }) => theme.colors.footerText}20;
`;

// App Component
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: '',
    time: '',
    reason: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  // Clinic location coordinates
  const clinicLocation = [19.0760, 72.8777]; // Mumbai coordinates

  // Services data
  const servicesData = [
    { id: 1, img: images.backPain, title: 'Back Pain Treatment' },
    { id: 2, img: images.wristPain, title: 'Joint Pain Treatment' },
    { id: 3, img: images.slippedDisc, title: 'Slipped Disc Treatment' },
    { id: 4, img: images.neckPain, title: 'Neck Pain Treatment' },
    { id: 5, img: images.anklePain, title: 'Joint Pain Treatment' },
    { id: 6, img: images.headache, title: 'Headache Treatment' },
    { id: 7, img: images.kneePain, title: 'Knee Pain Treatment' },
    { id: 8, img: images.sportInjuries, title: 'Sports Injuries Treatment' },
  ];

  // Patient resources data
  const resourcesData = [
    { 
      id: 1, 
      type: 'testimonial',
      img: images.patientImage,
      content: '"Dr. Rajeev Menon is truly a great doctor. He has lots of experience and his approach is very friendly."',
      author: '- Priya Mehta',
      buttonText: 'Read More'
    },
    { 
      id: 2, 
      type: 'faq',
      title: 'Frequently Asked Questions',
      items: [
        'How can I get my prescription?',
        'What should I bring to my appointment?',
        'What should I expect during my first checkup?'
      ],
      buttonText: 'View all'
    },
    { 
      id: 3, 
      type: 'calendar',
      title: 'Schedule an Appointment',
      img: images.calendarImage,
      icon: <FaCalendarAlt size={24} />
    },
    { 
      id: 4, 
      type: 'blog',
      title: 'Blog',
      img: images.stethoscopeImage,
      content: 'Understanding Chronic Pain',
      buttonText: 'Read more'
    }
  ];

  // Testimonials for carousel
  const testimonials = [
    {
      id: 1,
      name: 'Priya Mehta',
      role: 'Patient',
      content: 'Dr. Rajeev Menon is truly a great doctor. He has lots of experience and his approach is very friendly.',
      rating: 5
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      role: 'Athlete',
      content: 'After my sports injury, Dr. Menon helped me recover faster than expected. Highly recommended!',
      rating: 5
    },
    {
      id: 3,
      name: 'Ananya Patel',
      role: 'Office Worker',
      content: 'My chronic back pain is finally manageable thanks to the treatment plan from RelivaWell.',
      rating: 4
    }
  ];

  const toggleTheme = () => {
      setDarkMode(!darkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (activeTab === 'appointment' && !formData.date) errors.date = 'Date is required';
    if (activeTab === 'appointment' && !formData.time) errors.time = 'Time is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      // In a real app, you would send the form data to a server here
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      // Reset form after submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          date: '',
          time: '',
          reason: '',
        });
      }, 3000);
    } else {
      setFormErrors(errors);
    }
  };

  // Custom map controls component
  const MapControls = () => {
    const map = useMap();
    
    const zoomIn = () => {
      map.zoomIn();
    };
    
    const zoomOut = () => {
      map.zoomOut();
    };
    
    const handleZoomChange = (e) => {
      map.setZoom(parseInt(e.target.value));
    };

    return (
      <MapZoomControl>
        <button onClick={zoomIn}>+</button>
        <RangeInput 
          type="range" 
          min="1" 
          max="18" 
          value={map.getZoom()} 
          onChange={handleZoomChange} 
        />
        <button onClick={zoomOut}>-</button>
      </MapZoomControl>
    );
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <LogoContainer>
            <LogoImg src={images.logo} alt="RelivaWell Logo" />
            <LogoText>RelivaWell</LogoText>
          </LogoContainer>
          
          <Nav>
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#resources">Resources</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </Nav>
          
          <HeaderControls>
            <ThemeToggle onClick={toggleTheme}>
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </ThemeToggle>
            <AuthButtons>
              <LoginButton>Login</LoginButton>
              <SignupButton>Sign Up</SignupButton>
            </AuthButtons>
          </HeaderControls>
        </Header>

        <Main>
          {/* Hero Section */}
          <HeroSection id="home">
            <HeroContent>
              <HeroTitle>
                Expert <span>Physiotherapy</span> Care for <BlueText>Pain Relief</BlueText>
              </HeroTitle>
              <HeroDescription>
                At RelivaWell, we provide personalized physiotherapy treatments to help you recover from injuries, 
                manage chronic pain, and improve your overall mobility and quality of life.
              </HeroDescription>
              <PrimaryButton>Book an Appointment</PrimaryButton>
            </HeroContent>
            <HeroImage src={images.doctorImage} alt="Physiotherapist helping patient" />
          </HeroSection>

          {/* Doctor Section */}
          <DoctorSection id="about">
            <DoctorContainer>
              <DoctorImage src={images.doctorProfile} alt="Dr. Rajeev Menon" />
              <DoctorDetails>
                <DoctorName>Dr. Rajeev Menon</DoctorName>
                <DoctorSpecialty>Senior Physiotherapist & Pain Management Specialist</DoctorSpecialty>
                <DoctorQualification>
                  <FaGraduationCap /> MPT (Ortho), MIAP, CMP (Canada)
                </DoctorQualification>
                <DoctorExperience>
                  <FaClock /> 15+ Years of Experience
                </DoctorExperience>
                <Rating>
                  <Star filled /> <Star filled /> <Star filled /> <Star filled /> <Star filled />
                  <span style={{ marginLeft: '0.5rem', color: darkMode ? lightTheme.colors.textLight : darkTheme.colors.textLight }}>
                    4.9 (128 reviews)
                  </span>
                </Rating>
                <DoctorBio>
                  Dr. Rajeev Menon is a highly skilled physiotherapist specializing in orthopedic and sports injuries. 
                  With over 15 years of clinical experience, he has helped thousands of patients recover from pain 
                  and regain their mobility. His patient-centered approach combines evidence-based treatments with 
                  personalized care plans tailored to each individual's needs.
                </DoctorBio>
                <PrimaryButton>Learn More</PrimaryButton>
              </DoctorDetails>
            </DoctorContainer>
          </DoctorSection>

          {/* Services Section */}
          <ServicesSection id="services">
            <SectionHeader>
              <SectionSubtitle>Our Services</SectionSubtitle>
              <SectionTitle>Specialized Physiotherapy Treatments</SectionTitle>
              <SectionDescription>
                We offer comprehensive physiotherapy services to address a wide range of musculoskeletal conditions 
                and help you achieve optimal recovery and pain-free living.
              </SectionDescription>
            </SectionHeader>
            
            <ServicesGrid>
              {servicesData.map(service => (
                <ServiceCard key={service.id}>
                  <ServiceImage src={service.img} alt={service.title} />
                  <ServiceTitle>{service.title}</ServiceTitle>
                </ServiceCard>
              ))}
            </ServicesGrid>
            
            <SeeMoreButton>View All Services</SeeMoreButton>
          </ServicesSection>

          {/* Testimonials Section */}
          <TestimonialsSection>
            <SectionHeader>
              <SectionSubtitle>Testimonials</SectionSubtitle>
              <SectionTitle>What Our Patients Say</SectionTitle>
              <SectionDescription>
                Hear from our patients about their experiences and recovery journeys with RelivaWell Physiotherapy.
              </SectionDescription>
            </SectionHeader>
            
            <StyledCarousel 
              showArrows={true} 
              infiniteLoop={true} 
              showThumbs={false} 
              showStatus={false}
              autoPlay={true}
              interval={5000}
            >
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id}>
                  <TestimonialContent>
                    <TestimonialText>"{testimonial.content}"</TestimonialText>
                    <TestimonialAuthor>{testimonial.name}</TestimonialAuthor>
                    <p>{testimonial.role}</p>
                    <Rating>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < testimonial.rating} />
                      ))}
                    </Rating>
                  </TestimonialContent>
                </TestimonialCard>
              ))}
            </StyledCarousel>
          </TestimonialsSection>

          {/* Patient Resources Section */}
          <PatientResourcesSection id="resources">
            <ResourcesHeader>
              <ResourcesTitle>Patient Resources</ResourcesTitle>
              <ResourcesSubtitle>
                Helpful information and tools to support your treatment journey and recovery process.
              </ResourcesSubtitle>
            </ResourcesHeader>
            
            <ResourcesGrid>
              {resourcesData.map(resource => {
                if (resource.type === 'testimonial') {
                  return (
                    <ResourceCard key={resource.id}>
                      <PatientImage src={resource.img} alt="Patient" />
                      <TestimonialQuote>
                        {resource.content}
                        <PatientName>{resource.author}</PatientName>
                      </TestimonialQuote>
                      <ResourceButton>{resource.buttonText}</ResourceButton>
                    </ResourceCard>
                  );
                } else if (resource.type === 'faq') {
                  return (
                    <ResourceCard key={resource.id}>
                      <ResourceTitleWithIcon>
                        <FaGraduationCap /> {resource.title}
                      </ResourceTitleWithIcon>
                      <FaqList>
                        {resource.items.map((item, index) => (
                          <FaqItem key={index}>{item}</FaqItem>
                        ))}
                      </FaqList>
                      <ResourceButton>{resource.buttonText}</ResourceButton>
                    </ResourceCard>
                  );
                } else if (resource.type === 'calendar') {
                  return (
                    <ResourceCard key={resource.id}>
                      <ResourceTitleWithIcon>
                        {resource.icon} {resource.title}
                      </ResourceTitleWithIcon>
                      <CalendarImage src={resource.img} alt="Calendar" />
                      <ResourceButton>Book Now</ResourceButton>
                    </ResourceCard>
                  );
                } else if (resource.type === 'blog') {
                  return (
                    <ResourceCard key={resource.id}>
                      <ResourceTitle>{resource.title}</ResourceTitle>
                      <BlogImage src={resource.img} alt="Blog post" />
                      <ResourceContent>
                        <BlogExcerpt>{resource.content}</BlogExcerpt>
                        <ResourceMeta>
                          <ResourceDate>June 15, 2023</ResourceDate>
                          <ResourceAuthor>By Dr. Menon</ResourceAuthor>
                        </ResourceMeta>
                        <ResourceButton>{resource.buttonText}</ResourceButton>
                      </ResourceContent>
                    </ResourceCard>
                  );
                }
                return null;
              })}
            </ResourcesGrid>
          </PatientResourcesSection>

          {/* Contact Section */}
          <ContactSection id="contact">
            <SectionHeader>
              <SectionSubtitle>Get In Touch</SectionSubtitle>
              <SectionTitle>Contact Our Clinic</SectionTitle>
              <SectionDescription>
                Have questions or ready to book an appointment? Reach out to us using the form below or visit our clinic.
              </SectionDescription>
            </SectionHeader>
            
            <FormTabs>
              <TabButton 
                active={activeTab === 'contact'} 
                onClick={() => setActiveTab('contact')}
              >
                Contact Us
              </TabButton>
              <TabButton 
                active={activeTab === 'appointment'} 
                onClick={() => setActiveTab('appointment')}
              >
                Book Appointment
              </TabButton>
            </FormTabs>
            
            <FormContainer>
              {isSubmitted ? (
                <SuccessMessage>
                  <h3>Thank You!</h3>
                  <p>
                    {activeTab === 'contact' 
                      ? 'Your message has been sent successfully. We will get back to you soon.' 
                      : 'Your appointment request has been received. We will confirm your booking shortly.'}
                  </p>
                </SuccessMessage>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel>Full Name *</FormLabel>
                    <FormInput 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      error={formErrors.name}
                    />
                    {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Email Address *</FormLabel>
                    <FormInput 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      error={formErrors.email}
                    />
                    {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Phone Number</FormLabel>
                    <FormInput 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  {activeTab === 'appointment' && (
                    <>
                      <FormGroup>
                        <FormLabel>Preferred Date *</FormLabel>
                        <FormInput 
                          type="date" 
                          name="date" 
                          value={formData.date}
                          onChange={handleInputChange}
                          error={formErrors.date}
                        />
                        {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Preferred Time *</FormLabel>
                        <FormInput 
                          type="time" 
                          name="time" 
                          value={formData.time}
                          onChange={handleInputChange}
                          error={formErrors.time}
                        />
                        {formErrors.time && <ErrorText>{formErrors.time}</ErrorText>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormInput 
                          type="text" 
                          name="reason" 
                          placeholder="e.g. Back pain, Sports injury, etc."
                          value={formData.reason}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </>
                  )}
                  
                  {activeTab === 'contact' && (
                    <FormGroup>
                      <FormLabel>Your Message</FormLabel>
                      <FormTextarea 
                        name="message" 
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  )}
                  
                  <PrimaryButton type="submit">
                    {activeTab === 'contact' ? 'Send Message' : 'Book Appointment'}
                  </PrimaryButton>
                </Form>
              )}
            </FormContainer>
            
            <MapWrapper>
              <SectionSubtitle>Our Location</SectionSubtitle>
              <MapContainer 
                center={clinicLocation} 
                zoom={13} 
                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={clinicLocation}>
                  <Popup>
                    <strong>RelivaWell Physiotherapy Clinic</strong><br />
                    123 Wellness Avenue, Mumbai 400001
                  </Popup>
                </Marker>
                <MapControls />
              </MapContainer>
              
              <MapAddress>
                <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
                123 Wellness Avenue, Mumbai 400001, Maharashtra
              </MapAddress>
              
              <MapHours>
                <FaClock style={{ marginRight: '0.5rem' }} />
                Monday - Saturday: 9:00 AM - 7:00 PM | Sunday: Closed
              </MapHours>
            </MapWrapper>
          </ContactSection>
        </Main>

        {/* Footer */}
        <Footer>
          <FooterColumn>
            <FooterTitle>About RelivaWell</FooterTitle>
            <FooterText>
              RelivaWell Physiotherapy Clinic provides expert care for pain management, 
              injury rehabilitation, and mobility improvement.
            </FooterText>
            <SocialIcons>
              <SocialIcon href="#"><i className="fab fa-facebook-f"></i></SocialIcon>
              <SocialIcon href="#"><i className="fab fa-twitter"></i></SocialIcon>
              <SocialIcon href="#"><i className="fab fa-instagram"></i></SocialIcon>
              <SocialIcon href="#"><i className="fab fa-linkedin-in"></i></SocialIcon>
            </SocialIcons>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink href="#home">Home</FooterLink>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#services">Services</FooterLink>
            <FooterLink href="#resources">Patient Resources</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Our Services</FooterTitle>
            <FooterLink href="#">Back Pain Treatment</FooterLink>
            <FooterLink href="#">Neck Pain Treatment</FooterLink>
            <FooterLink href="#">Sports Injury Rehabilitation</FooterLink>
            <FooterLink href="#">Post-Surgical Rehabilitation</FooterLink>
            <FooterLink href="#">Joint Pain Management</FooterLink>
            <FooterLink href="#">Posture Correction</FooterLink>
            <FooterLink href="#">Custom Orthotics</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterTitle>Newsletter</FooterTitle>
            <FooterText>
              Subscribe to our newsletter for health tips, clinic updates, and special offers.
            </FooterText>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Your email address" />
              <NewsletterButton>Subscribe</NewsletterButton>
            </NewsletterForm>
          </FooterColumn>
        </Footer>
        
        <Copyright>
          &copy; {new Date().getFullYear()} RelivaWell Physiotherapy Clinic. All Rights Reserved.
        </Copyright>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
