/*
 * Ignite Guild Website JavaScript
 *
 * This script powers the interactive parts of the guild website.  It defines
 * sample data for events, reminders and guild members, and exposes
 * initialisation functions that run when the respective pages load.  The
 * calendar, directory and reminders use the same data across pages.  Local
 * storage is used to remember which reminders have been completed.
 */

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Sample list of guild events.  Each object includes a title, date (ISO
   * format), time, location and description.  Feel free to add your own
   * upcoming or past events here – the calendar and events pages will update
   * automatically.
   */
  const events = [
    {
      title: 'Weekly Game Night',
      date: '2025-09-03',
      time: '8:00 PM NST',
      location: 'Guild Chat (Discord)',
      description: 'Join us for an evening of games and chatter. We\'ll play a variety of Neopian games together.'
    },
    {
      title: 'Council Meeting',
      date: '2025-09-07',
      time: '7:00 PM NST',
      location: 'Council Channel',
      description: 'A closed meeting for council members to discuss upcoming events and guild improvements.'
    },
    {
      title: 'Charity Auction',
      date: '2025-09-21',
      time: '3:00 PM NST',
      location: 'Guild Shop',
      description: 'Donate your unwanted items and bid on unique treasures. Proceeds support guild events.'
    },
    {
      title: 'Monthly Treasure Hunt',
      date: '2025-09-15',
      time: '6:00 PM NST',
      location: 'Guild Forum',
      description: 'Follow clues hidden throughout our site and across Neopia to find secret treasures and win prizes!'
    },
    {
      title: 'Halloween Costume Contest',
      date: '2025-10-25',
      time: '5:00 PM NST',
      location: 'Guild Hall',
      description: 'Show off your spookiest costumes! Voting will take place and winners receive exclusive items.'
    },
    {
      title: 'Holiday Gift Exchange',
      date: '2025-12-20',
      time: '12:00 PM NST',
      location: 'Guild Board',
      description: 'Spread holiday cheer by exchanging gifts with fellow guild members! Sign up to participate.'
    }
  ];

  /**
   * Reminder tasks for the checklist.  These tasks encourage members to keep up
   * with daily Neopian activities and guild involvement.  Completed tasks are
   * stored in local storage so they persist between visits.
   */
  const tasks = [
    {
      title: 'Collect daily freebies',
      description: 'Visit Soup Kitchen, Free Jelly and Giant Omelette for daily freebies!'
    },
    {
      title: 'Spin the wheels',
      description: 'Don\'t forget to spin the wheels like Mediocrity, Knowledge and Monotony for extra prizes.'
    },
    {
      title: 'Check the guild board',
      description: 'Visit the guild board to see new messages and announcements.'
    },
    {
      title: 'Participate in the next event',
      description: 'Sign up for the next guild event or competition!'
    },
    {
      title: 'Update your wishlist',
      description: 'Keep your item wishlist up‑to‑date in the guild directory.'
    }
  ];

  /**
   * Member directory.  Each member has a name, username, role, join date and
   * tagline.  Council members are flagged with `council: true` and include a
   * longer biography used on the Council page.  Colours for avatars are
   * generated based on the member name to provide consistency across pages.
   */
  const members = [
    {
      name: 'Alyssa Flames',
      username: 'dragon_fire',
      role: 'Leader',
      joinDate: '2024-01-10',
      tagline: 'Leading the guild into fiery adventures.',
      council: true,
      bio: 'Alyssa founded Ignite with the goal of creating a warm and welcoming community. She loves organising events and helping members reach their goals.'
    },
    {
      name: 'Blaze Runner',
      username: 'blazie',
      role: 'Co‑Leader',
      joinDate: '2024-03-21',
      tagline: 'Always ready for a race in the Lost Desert!',
      council: true,
      bio: 'Blaze is our co‑leader, known for their boundless energy and passion for competition. They manage our weekly game nights and keep the atmosphere lively.'
    },
    {
      name: 'Ember Spark',
      username: 'ember_s',
      role: 'Council Member',
      joinDate: '2024-05-08',
      tagline: 'Collecting all the plushies in Neopia.',
      council: true,
      bio: 'Ember oversees our resources section, curating guides and links for the guild. When not reading, you\'ll find them exploring the Hidden Tower.'
    },
    {
      name: 'Pyro Pixie',
      username: 'pyropixie',
      role: 'Council Member',
      joinDate: '2024-07-15',
      tagline: 'Faerie queen in training.',
      council: true,
      bio: 'A lover of all things magical, Pyro organises our treasure hunts and creative contests. She also manages the guild\'s art gallery.'
    },
    {
      name: 'Inferno Knight',
      username: 'inferno_knight',
      role: 'Council Member',
      joinDate: '2024-09-30',
      tagline: 'Defender of the guild.',
      council: true,
      bio: 'Inferno leads our battling initiatives, training sessions and tournaments. Their strategies help members strengthen their pets.'
    },
    {
      name: 'Sunny Day',
      username: 'sunny_d',
      role: 'Member',
      joinDate: '2025-02-20',
      tagline: 'Bringing sunshine to everyone.',
      council: false
    },
    {
      name: 'Lava Lamp',
      username: 'lava_lamp',
      role: 'Member',
      joinDate: '2025-03-11',
      tagline: 'Calm and bright.',
      council: false
    },
    {
      name: 'FlareonFan',
      username: 'flareonfan',
      role: 'Member',
      joinDate: '2024-11-01',
      tagline: 'Flareon is the best!',
      council: false
    },
    {
      name: 'Spark Storm',
      username: 'sparkstorm',
      role: 'Member',
      joinDate: '2025-06-01',
      tagline: 'Shockingly friendly.',
      council: false
    },
    {
      name: 'Blitz',
      username: 'blitz_neo',
      role: 'Member',
      joinDate: '2025-07-12',
      tagline: 'Speed and spark combined.',
      council: false
    }
  ];

  /**
   * Parse a date string in YYYY-MM-DD format into a Date object without
   * accounting for timezone offsets.  Using the Date constructor directly on
   * such strings can shift the day due to implicit UTC interpretation.  This
   * helper ensures the date remains as intended by constructing the Date with
   * year, month (zero‑based) and day components manually.
   * @param {string} dateString
   * @returns {Date}
   */
  function parseLocalDate(dateString) {
    const parts = dateString.split('-').map(Number);
    // parts: [year, month, day]
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  /**
   * Converts a string to a colour.  This helper generates a pseudo‑random colour
   * based on the characters of the string.  The same input always produces
   * the same colour, which we use to give each member a unique but consistent
   * avatar background.
   * @param {string} str
   * @returns {string} CSS hex colour
   */
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  /**
   * Renders the event list on the events page.  Events are sorted by date and
   * displayed in cards.  Each card shows the day/month, full date & time,
   * location and description.
   */
  function renderEvents() {
    const list = document.querySelector('.event-list');
    if (!list) return;
    list.innerHTML = '';
    const sorted = [...events].sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    sorted.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card';
      const date = parseLocalDate(ev.date);
      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.innerHTML = `<div class="day">${date.getDate()}</div><div class="month">${monthNames[date.getMonth()]}</div>`;
      const details = document.createElement('div');
      details.className = 'details';
      const title = document.createElement('h4');
      title.textContent = ev.title;
      const time = document.createElement('p');
      time.innerHTML = `<strong>Date:</strong> ${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} &nbsp; <strong>Time:</strong> ${ev.time}`;
      const loc = document.createElement('p');
      loc.innerHTML = `<strong>Location:</strong> ${ev.location}`;
      const desc = document.createElement('p');
      desc.textContent = ev.description;
      details.appendChild(title);
      details.appendChild(time);
      details.appendChild(loc);
      details.appendChild(desc);
      card.appendChild(dateDiv);
      card.appendChild(details);
      list.appendChild(card);
    });
  }

  /**
   * Initialises the calendar page.  The calendar uses a simple grid layout to
   * display days of the week and month, highlights days with events and lists
   * the events for a selected day.  Navigation buttons allow switching
   * months.  Days outside the current month are faded.
   */
  function initCalendar() {
    const calElem = document.getElementById('calendar-grid');
    const monthYearElem = document.getElementById('calendar-month-year');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const eventListElem = document.getElementById('calendar-event-list');
    if (!calElem || !monthYearElem || !prevBtn || !nextBtn) return;
    let currentDate = new Date();
    currentDate.setDate(1);
    function renderCalendar() {
      calElem.innerHTML = '';
      eventListElem.innerHTML = '';
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();
      monthYearElem.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      // Header row for days of week
      daysOfWeek.forEach(dayName => {
        const headerCell = document.createElement('div');
        headerCell.className = 'calendar-day header';
        headerCell.textContent = dayName;
        calElem.appendChild(headerCell);
      });
      // Build a map of events for the current month
      const eventsMap = {};
      events.forEach(ev => {
        const d = parseLocalDate(ev.date);
        if (d.getMonth() === month && d.getFullYear() === year) {
          const day = d.getDate();
          if (!eventsMap[day]) eventsMap[day] = [];
          eventsMap[day].push(ev);
        }
      });
      // Previous month days to fill the first week
      for (let i = firstDay; i > 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        cell.innerHTML = `<div class="date-num">${prevDays - i + 1}</div>`;
        calElem.appendChild(cell);
      }
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.innerHTML = `<div class="date-num">${i}</div>`;
        if (eventsMap[i]) {
          cell.classList.add('has-event');
        }
        cell.addEventListener('click', () => {
          if (eventsMap[i]) {
            renderEventList(eventsMap[i], i);
          } else {
            eventListElem.innerHTML = '';
          }
        });
        calElem.appendChild(cell);
      }
      // Next month days to fill the grid evenly (ensuring a consistent 7×n grid)
      const totalCells = firstDay + daysInMonth;
      const nextDays = 7 - (totalCells % 7);
      if (nextDays < 7) {
        for (let i = 1; i <= nextDays; i++) {
          const cell = document.createElement('div');
          cell.className = 'calendar-day other-month';
          cell.innerHTML = `<div class="date-num">${i}</div>`;
          calElem.appendChild(cell);
        }
      }
    }
    function renderEventList(eventArray, day) {
      eventListElem.innerHTML = '';
      const heading = document.createElement('h4');
      heading.textContent = `Events on ${currentDate.toLocaleString('default', { month: 'long' })} ${day}, ${currentDate.getFullYear()}`;
      eventListElem.appendChild(heading);
      eventArray.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.innerHTML = `<strong>${ev.title}</strong><br>${ev.time} – ${ev.location}<br>${ev.description}`;
        eventListElem.appendChild(item);
      });
    }
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
    renderCalendar();
  }

  /**
   * Initialises the reminders page.  Loads any completed tasks from local
   * storage, renders the list with checkboxes, and allows users to mark
   * reminders as complete.  A clear button resets all tasks.
   */
  function initReminders() {
    const listElem = document.getElementById('reminder-list');
    const clearBtn = document.getElementById('clear-completed');
    if (!listElem || !clearBtn) return;
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    function renderTasks() {
      listElem.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'reminder-item';
        if (completedTasks.includes(index)) li.classList.add('completed');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completedTasks.includes(index);
        checkbox.addEventListener('change', () => toggleComplete(index));
        const label = document.createElement('span');
        label.textContent = task.title;
        li.appendChild(checkbox);
        li.appendChild(label);
        listElem.appendChild(li);
      });
    }
    function toggleComplete(i) {
      const idx = completedTasks.indexOf(i);
      if (idx > -1) {
        completedTasks.splice(idx, 1);
      } else {
        completedTasks.push(i);
      }
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      renderTasks();
    }
    clearBtn.addEventListener('click', () => {
      completedTasks = [];
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      renderTasks();
    });
    renderTasks();
  }

  /**
   * Renders the member directory.  A search bar filters members by name,
   * username or role.  Each card displays an avatar with the initial letter
   * coloured consistently for each user, plus their username and role.
   */
  function initDirectory() {
    const grid = document.getElementById('member-grid');
    const search = document.getElementById('member-search');
    if (!grid || !search) return;
    function renderMembers(filter) {
      grid.innerHTML = '';
      const filtered = members.filter(m => {
        const query = filter.toLowerCase();
        return m.name.toLowerCase().includes(query) || m.username.toLowerCase().includes(query) || m.role.toLowerCase().includes(query);
      });
      if (filtered.length === 0) {
        const msg = document.createElement('p');
        msg.textContent = 'No members found.';
        grid.appendChild(msg);
      } else {
        filtered.forEach(m => {
          const card = document.createElement('div');
          card.className = 'member-card';
          const avatar = document.createElement('div');
          avatar.className = 'member-avatar';
          avatar.textContent = m.name.charAt(0).toUpperCase();
          avatar.style.backgroundColor = stringToColor(m.name);
          const details = document.createElement('div');
          details.className = 'member-details';
          const nameEl = document.createElement('h4');
          nameEl.textContent = m.name;
          const userEl = document.createElement('p');
          userEl.textContent = '@' + m.username;
          const roleEl = document.createElement('p');
          roleEl.textContent = m.role;
          details.appendChild(nameEl);
          details.appendChild(userEl);
          details.appendChild(roleEl);
          card.appendChild(avatar);
          card.appendChild(details);
          grid.appendChild(card);
        });
      }
    }
    search.addEventListener('input', () => {
      renderMembers(search.value.trim());
    });
    renderMembers('');
  }

  /**
   * Renders the council page.  Only members flagged with `council: true` are
   * displayed.  Clicking the View Bio button toggles the visibility of a
   * member\'s biography.  Colours and layout mirror the directory but allow
   * vertical stacking of elements.
   */
  function initCouncil() {
    const grid = document.querySelector('.council-grid');
    if (!grid) return;
    const councilMembers = members.filter(m => m.council);
    councilMembers.forEach(m => {
      const card = document.createElement('div');
      card.className = 'council-card';
      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = m.name.charAt(0).toUpperCase();
      avatar.style.backgroundColor = stringToColor(m.name);
      const name = document.createElement('h4');
      name.textContent = m.name;
      const role = document.createElement('div');
      role.className = 'role';
      role.textContent = m.role;
      const bio = document.createElement('div');
      bio.className = 'bio';
      bio.textContent = m.bio || 'No biography provided.';
      const btn = document.createElement('button');
      btn.textContent = 'View Bio';
      btn.addEventListener('click', () => {
        card.classList.toggle('expanded');
        btn.textContent = card.classList.contains('expanded') ? 'Hide Bio' : 'View Bio';
      });
      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(role);
      card.appendChild(bio);
      card.appendChild(btn);
      grid.appendChild(card);
    });
  }

  // Determine which page is currently loaded and call the appropriate initialiser.
  const pageId = document.body.id;
  switch (pageId) {
    case 'events':
      renderEvents();
      break;
    case 'calendar':
      initCalendar();
      break;
    case 'reminders':
      initReminders();
      break;
    case 'directory':
      initDirectory();
      break;
    case 'council':
      initCouncil();
      break;
    default:
      // Home page or other pages don\'t require JS initialisation
      break;
  }
});