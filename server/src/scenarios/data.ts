export type Scenario = 'simple' | 'medium' | 'heavy' | 'extreme';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  score: number;
}

interface Employee {
  name: string;
  role: string;
  level: number;
}

interface Department {
  name: string;
  manager: string;
  employees: Employee[];
}

export interface ScenarioData {
  title: string;
  description: string;
  items: string[];
  users: User[];
  departments?: Department[];
}

// Детерминированные данные — не меняются между запусками
function makeItems(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Item ${i + 1}: value=${(i * 7 + 1) % 100}`);
}

function makeUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@rendermeter.dev`,
    active: i % 3 !== 0,
    score: (i * 17 + 43) % 100,
  }));
}

function makeDepartments(deptCount: number, empPerDept: number): Department[] {
  const roles = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Lead'];
  return Array.from({ length: deptCount }, (_, d) => ({
    name: `Department ${d + 1}`,
    manager: `Manager ${d + 1}`,
    employees: Array.from({ length: empPerDept }, (_, e) => ({
      name: `Emp ${d * empPerDept + e + 1}`,
      role: roles[(d + e) % roles.length],
      level: (e % 5) + 1,
    })),
  }));
}

// Данные генерируются один раз при загрузке модуля
const SCENARIO_DATA: Record<Scenario, ScenarioData> = {
  simple: {
    title: 'Simple Scenario',
    description: 'Minimal template — no loops, just a short list',
    items: makeItems(5),
    users: makeUsers(5),
  },
  medium: {
    title: 'Medium Scenario',
    description: '100 items + 100-row users table with conditionals',
    items: makeItems(100),
    users: makeUsers(100),
  },
  heavy: {
    title: 'Heavy Scenario',
    description: '500 items + 200 users + 10 departments × 20 employees',
    items: makeItems(500),
    users: makeUsers(200),
    departments: makeDepartments(10, 20),
  },
  extreme: {
    title: 'Extreme Scenario',
    description: '1000 items + 500 users + 20 departments × 50 employees',
    items: makeItems(1000),
    users: makeUsers(500),
    departments: makeDepartments(20, 50),
  },
};

export function getScenarioData(scenario: Scenario): ScenarioData {
  return SCENARIO_DATA[scenario];
}
