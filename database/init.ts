import { EventCategory } from '@/constants/eventCategory';
import { notificationService } from '@/services/notificationService';
import { db } from './db';
import { createEvent, updateEventNotification } from './events';

const events = [
  {
    id: "1",
    title: "Introduction to AI",
    description: "Basics of Artificial Intelligence and its applications.",
    category: "Talk" as EventCategory,
    startDateTime: "2026-06-10T10:00:00",
    endDateTime: "2026-06-10T12:00:00",
    locationName: "Main Auditorium",
    locationAddress: "Campus A, Building 1",
    organizerName: "Tech Club",
    capacity: 100,
    registeredCount: 45,
    imageUrl: undefined,
    tags: ["AI", "Machine Learning", "Technology"],
    createdAt: "2026-05-01T09:00:00",
  },
  {
    id: "2",
    title: "React Workshop",
    description: "Hands-on workshop on building apps with React.",
    category: "Workshop" as EventCategory,
    startDateTime: "2026-05-15T15:42:00",
    endDateTime: "2026-06-12T18:00:00",
    locationName: "Lab 202",
    locationAddress: "Campus B, IT Building",
    organizerName: "Dev Society",
    capacity: 30,
    registeredCount: 25,
    imageUrl: undefined,
    tags: ["React", "JavaScript", "Frontend"],
    createdAt: "2026-05-01T10:15:00",
  },
  {
    id: "3",
    title: "Chess Club Weekly Meetup",
    description: "Weekly meetup for chess enthusiasts.",
    category: "Club" as EventCategory,
    startDateTime: "2026-06-11T17:00:00",
    endDateTime: "2026-06-11T19:00:00",
    locationName: "Student Lounge",
    locationAddress: "Campus Center",
    organizerName: "Chess Club",
    capacity: 20,
    registeredCount: 12,
    imageUrl: undefined,
    tags: ["Chess", "Strategy", "Games"],
    createdAt: "2026-05-02T14:30:00",
  },
  {
    id: "4",
    title: "Final Exam - Databases",
    description: "End semester database exam.",
    category: "Exam" as EventCategory,
    startDateTime: "2026-06-20T09:00:00",
    endDateTime: "2026-06-20T11:00:00",
    locationName: "Room 305",
    locationAddress: "Engineering Building",
    organizerName: "Faculty of CS",
    capacity: 200,
    registeredCount: 181,
    imageUrl: undefined,
    tags: ["Database", "SQL", "Exam"],
    createdAt: "2026-05-03T08:00:00",
  },
  {
    id: "5",
    title: "Startup Pitch Night",
    description: "Students pitch startup ideas to judges.",
    category: "Other" as EventCategory,
    startDateTime: "2026-06-15T18:00:00",
    endDateTime: "2026-06-15T21:00:00",
    locationName: "Conference Hall",
    locationAddress: "Campus Innovation Hub",
    organizerName: "Entrepreneur Club",
    capacity: 80,
    registeredCount: 60,
    imageUrl: undefined,
    tags: ["Startup", "Business", "Pitch"],
    createdAt: "2026-05-03T16:45:00",
  },
  {
    id: "6",
    title: "Cybersecurity Talk",
    description: "Learn about modern cybersecurity threats.",
    category: "Talk" as EventCategory,
    startDateTime: "2026-06-18T11:00:00",
    endDateTime: "2026-06-18T13:00:00",
    locationName: "Auditorium B",
    locationAddress: "Campus A",
    organizerName: "Security Group",
    capacity: 120,
    registeredCount: 75,
    imageUrl: undefined,
    tags: ["Security", "Hacking", "IT"],
    createdAt: "2026-05-04T11:20:00",
  },
  {
    id: "7",
    title: "Docker & DevOps Workshop",
    description: "Learn Docker basics and CI/CD pipelines.",
    category: "Workshop" as EventCategory,
    startDateTime: "2026-06-22T13:00:00",
    endDateTime: "2026-06-22T17:00:00",
    locationName: "Lab 101",
    locationAddress: "Tech Building",
    organizerName: "DevOps Club",
    capacity: 25,
    registeredCount: 20,
    imageUrl: undefined,
    tags: ["Docker", "DevOps", "CI/CD"],
    createdAt: "2026-05-04T13:00:00",
  },
  {
    id: "8",
    title: "Photography Club Meetup",
    description: "Discuss photography techniques and share work.",
    category: "Club" as EventCategory,
    startDateTime: "2026-06-14T16:00:00",
    endDateTime: "2026-06-14T18:00:00",
    locationName: "Art Room",
    locationAddress: "Campus Arts Center",
    organizerName: "Photo Club",
    capacity: 15,
    registeredCount: 11,
    imageUrl: undefined,
    tags: ["Photography", "Art", "Creative"],
    createdAt: "2026-05-05T09:30:00",
  },
  {
    id: "9",
    title: "Math Exam - Calculus II",
    description: "Final calculus exam covering integrals.",
    category: "Exam" as EventCategory,
    startDateTime: "2026-06-25T08:00:00",
    endDateTime: "2026-06-25T10:00:00",
    locationName: "Room 210",
    locationAddress: "Science Building",
    organizerName: "Math Department",
    capacity: 150,
    registeredCount: 140,
    imageUrl: undefined,
    tags: ["Math", "Calculus", "Exam"],
    createdAt: "2026-05-05T10:00:00",
  },
  {
    id: "10",
    title: "Gaming Tournament",
    description: "Competitive gaming event with prizes.",
    category: "Other" as EventCategory,
    startDateTime: "2026-06-28T15:00:00",
    endDateTime: "2026-06-28T20:00:00",
    locationName: "Gaming Arena",
    locationAddress: "Campus Recreation Center",
    organizerName: "Gaming Club",
    capacity: 60,
    registeredCount: 50,
    imageUrl: undefined,
    tags: ["Gaming", "Esports", "Competition"],
    createdAt: "2026-05-06T12:00:00",
  },
  {
    id: "11",
    title: "Workshop React Native Avancé",
    description:
      "Apprenez les patterns avancés de React Native avec Expo Router et Zustand.",
    category: "Workshop" as EventCategory,
    startDateTime: "2026-06-04T20:24:49.183Z",
    endDateTime: "2026-04-22T21:24:00.000Z",
    locationName: "Salle B12",
    locationAddress: "Campus Universitaire, Tanger",
    organizerName: "Club Informatique ENSA",
    capacity: 60,
    registeredCount: 53,
    imageUrl: undefined,
    tags: ["IOS"],
    createdAt: "2026-04-22T20:25:39.050Z",
  },
  {
    id: "12",
    title: "Conférence IA & Machine Learning",
    description:
      "Introduction aux modèles modernes d’intelligence artificielle et leurs applications.",
    category: "Talk" as EventCategory,
    startDateTime: "2026-06-07T08:50:00.000Z",
    endDateTime: undefined,
    locationName: "Amphi A",
    locationAddress: "Faculté des Sciences",
    organizerName: "AI Club UAE",
    capacity: 200,
    registeredCount: 129,
    imageUrl: undefined,
    tags: ["ai", "ML", "Data"],
    createdAt: "2026-04-22T20:52:45.947Z",
  },
];


export function initDatabase() {
  db.execSync('PRAGMA foreign_keys = ON;');

  db.execSync(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      startDateTime TEXT NOT NULL,
      endDateTime TEXT,
      locationName TEXT NOT NULL,
      locationAddress TEXT,
      organizerName,
      capacity INTEGER,
      registeredCount INTEGER DEFAULT 0,
      imageUrl TEXT,
      tags TEXT,
      createdAt TEXT NOT NULL,
      notificationId TEXT
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      eventId TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      PRIMARY KEY (eventId, userId),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS llm_results (
      id TEXT PRIMARY KEY,
      eventId TEXT,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      inputText TEXT NOT NULL,
      outputText TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `)

  const countResult = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM events;');

  if (countResult?.count === 0) {
    seedDatabase();
  }
}

const seedDatabase = () => {
  events.forEach(async (event) => {
    const savedEvent = await createEvent(event);

    const notificationId = await notificationService.scheduleEventNotification(event);

    await updateEventNotification({ ...event, id: savedEvent.lastInsertRowId.toString() }, notificationId)
  })
}

