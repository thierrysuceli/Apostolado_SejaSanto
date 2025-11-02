import React, { useState } from 'react';
import { dbEvents } from '../data/mockDatabase';
import { useAuth } from '../context/AuthContext';

const Calendar = () => {
  const { hasAccess } = useAuth();
  const [currentDate] = useState(new Date(2025, 10, 1)); // November 2025

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const dateStr = `2025-11-${String(day).padStart(2, '0')}`;
    return dbEvents.filter(event => event.date === dateStr);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Create array of days including empty slots for proper alignment
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-500 dark:text-gray-400 mb-4">
            Calendário de Eventos
          </h1>
          <p className="text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
            Confira nossos eventos e participe conosco!
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 md:p-8 shadow-lg">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-500 dark:text-gray-400 capitalize">{monthName}</h2>
            <div className="text-primary-700 font-semibold">Agenda de novembro</div>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center py-3 text-primary-600 font-semibold text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDay(day);
              const visibleEvents = dayEvents.filter(event => hasAccess(event.requiredRoles));
              const hasEvents = visibleEvents.length > 0;
              const isToday = day === 1; // Mock: treating day 1 as today

              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-2 ${
                    isToday ? 'bg-primary-100 border-primary-500 shadow-md' : 'bg-white dark:bg-gray-800 border-beige-200'
                  } ${hasEvents ? 'cursor-pointer hover:bg-beige-50' : ''}`}
                >
                  <div className="h-full flex flex-col">
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-primary-600' : 'text-secondary-700'
                    }`}>
                      {day}
                    </div>
                    
                    {visibleEvents.length > 0 && (
                      <div className="flex-1 space-y-1 overflow-hidden">
                        {visibleEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="bg-primary-600 text-white text-xs px-1 py-0.5 rounded truncate shadow-sm"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {visibleEvents.length > 2 && (
                          <div className="text-primary-600 text-xs font-medium">
                            +{visibleEvents.length - 2} mais
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary-500 dark:text-gray-400 mb-6">Próximos Eventos</h2>
          <div className="space-y-4">
            {dbEvents.map(event => {
              const canAccess = hasAccess(event.requiredRoles);
              
              return (
                <div
                  key={event.id}
                  className={`bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-6 shadow-md ${
                    !canAccess ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm">
                          {new Date(event.date).getDate()}
                        </div>
                        <div>
                          <h3 className="text-secondary-500 font-bold text-lg flex items-center">
                            {event.title}
                            {!canAccess && (
                              <svg className="w-5 h-5 text-primary-700 dark:text-primary-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                          </h3>
                          <p className="text-secondary-600 dark:text-gray-300 text-sm">{event.time}</p>
                        </div>
                      </div>
                      {canAccess && (
                        <p className="text-secondary-500 ml-0 md:ml-20">{event.description}</p>
                      )}
                      {!canAccess && (
                        <p className="text-secondary-600 dark:text-gray-300 italic ml-0 md:ml-20">
                          Este evento é restrito a membros com acesso especial.
                        </p>
                      )}
                    </div>
                    
                    {canAccess && (
                      <button className="mt-4 md:mt-0 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-md whitespace-nowrap">
                        Participar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
