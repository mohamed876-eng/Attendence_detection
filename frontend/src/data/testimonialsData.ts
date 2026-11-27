import { Testimonial } from '../types';
import prof1 from '../assets/testimonials/prof1.png';
import prof2 from '../assets/testimonials/prof2.png';
import prof3 from '../assets/testimonials/prof3.png';
import prof4 from '../assets/testimonials/prof4.png';
import prof5 from '../assets/testimonials/prof5.png';
import prof6 from '../assets/testimonials/prof6.png';
import prof7 from '../assets/testimonials/prof7.png';
import prof8 from '../assets/testimonials/prof8.jpg';

/**
 * Clearly labeled demo testimonials for Hadir biometric attendance.
 * Perspectives from university professors, lecturers, and faculty members.
 */
export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Dr. Kacem Kadiri',
    department: 'Professor of Software Engineering',
    avatar: prof1,
    rating: 5,
    quote:
      'Taking roll in a 180-student auditorium used to burn 15 valuable lecture minutes. With Hadir, I simply walk in and teach while attendance reports generate automatically in real time.',
    isDemo: true
  },
  {
    id: 't-2',
    name: 'Prof. Omar Benali',
    department: 'Head of Artificial Intelligence Dept.',
    avatar: prof2,
    rating: 5,
    quote:
      'Proxy attendance and buddy sign-ins are completely eliminated. The face recognition pipeline gives our department trustworthy, tamper-proof check-in records every session.',
    isDemo: true
  },
  {
    id: 't-3',
    name: 'Dr. Salma Tazi',
    department: 'Associate Professor, Data Science',
    avatar: prof3,
    rating: 5,
    quote:
      'The speed is remarkable. Students enter the computer labs naturally without queueing at scanners, and their attendance syncs directly into our university grading portal.',
    isDemo: true
  },
  {
    id: 't-4',
    name: 'Prof. Karim Mansouri',
    department: 'Senior Lecturer, Computer Systems',
    avatar: prof4,
    rating: 4,
    quote:
      'Resolving attendance disputes used to consume hours during office hours. Having exact timestamps and verification logs has made communication with students totally transparent.',
    isDemo: true
  },
  {
    id: 't-5',
    name: 'Dr. Zayd El Idrissi',
    department: 'Faculty of Cybersecurity',
    avatar: prof5,
    rating: 5,
    quote:
      '“Attendance in a glance” revolutionized our lecture flow. Classes begin promptly at 8:00 AM without disruptions, lost sign-up sheets, or manual roll-call fatigue.',
    isDemo: true
  },
  {
    id: 't-6',
    name: 'Prof. Mehdi Chraibi',
    department: 'Director of Network Engineering',
    avatar: prof6,
    rating: 5,
    quote:
      'Managing campus-wide compliance was an administrative headache. Hadir provides instant analytics on student presence across all my lab sections effortlessly.',
    isDemo: true
  },
  {
    id: 't-7',
    name: 'Dr. Salah Alami',
    department: 'Lecturer in Robotics & Automation',
    avatar: prof7,
    rating: 4,
    quote:
      'Even in large amphitheatres with changing lighting conditions, the detection is seamless. It lets me focus entirely on mentoring rather than administrative tracking.',
    isDemo: true
  },
  {
    id: 't-8',
    name: 'Prof. Said Hraoui',
    department: 'Chair of Information Systems',
    avatar: prof8,
    rating: 5,
    quote:
      'A quiet, reliable tool that elevated our academic workflow. Faculty members across our department adopted it effortlessly from day one.',
    isDemo: true
  }
];

/**
 * Builds a repeated sequence of testimonials for infinite seamless scrolling.
 * Ensures that even with only 5 portraits, the sequence has enough cards
 * to exceed the visible container height before being duplicated.
 */
export function buildColumnSequence(
  items: Testimonial[],
  offset: number,
  minLength: number = 6
): Testimonial[] {
  if (!items || items.length === 0) return [];
  const n = items.length;
  // Rotate items by offset so each column starts at a distinct card
  const rotated = items.map((_, i) => items[(i + offset) % n]);

  let sequence = [...rotated];
  while (sequence.length < minLength) {
    sequence = [...sequence, ...rotated];
  }
  return sequence;
}
