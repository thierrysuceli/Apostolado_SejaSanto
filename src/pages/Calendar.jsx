import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import EventModal from '../components/EventModal';
import '../styles/fullcalendar-custom.css';

const Calendar = () => {
  const api = useApi();
  const { user, isAdmin, hasPermission } = useAuth();
  const calendarRef = useRef(null);
  
  const [allEvents, setAllEvents] = useState([]); // Store all events
  const [events, setEvents] = useState([]); // Filtered events for display
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    all_day: false,
    location: '',
    meeting_link: '',
    color: '',
    categories: [],
    roles: [],
    users: []
  });

  // Load events and categories on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter events locally when categories change
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setEvents(allEvents);
    } else {
      const filtered = allEvents.filter(event =>
        event.extendedProps.categories.some(cat =>
          selectedCategories.includes(cat.category_id)
        )
      );
      setEvents(filtered);
    }
  }, [selectedCategories, allEvents]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 🔄 Load events with cache busting (force fresh data)
      const timestamp = Date.now();
      const eventsData = await api.events.getAll();
      const loadedEvents = eventsData.events || [];
      
      // Load categories
      const categoriesData = await api.eventCategories.getAll();
      setCategories(categoriesData.categories || []);
      
      // Load ALL roles (admin endpoint to get all, not just public)
      if (isAdmin() || hasPermission('manage_events')) {
        try {
          const rolesData = await api.admin.roles.getAll();
          setRoles(rolesData.roles || []);
        } catch (err) {
          console.error('Error loading roles:', err);
          // Fallback to public roles if admin fails
          const publicRolesData = await api.roles.getAll();
          setRoles(publicRolesData.roles || []);
        }
      } else {
        const rolesData = await api.roles.getAll();
        setRoles(rolesData.roles || []);
      }
      
      // Load all users (admin only)
      if (isAdmin() || hasPermission('manage_events')) {
        try {
          const usersData = await api.admin.users.getAll();
          setUsers(usersData.users || []);
          console.log('Loaded users:', usersData.users?.length); // Debug
        } catch (err) {
          console.error('Error loading users:', err);
        }
      }
      
      // Transform events for FullCalendar
      const transformedEvents = loadedEvents.map(event => {
        console.log('Event data:', event); // Debug
        return {
          id: event.id,
          title: event.title,
          start: event.start_date,
          end: event.end_date || event.start_date,
          allDay: event.all_day || false,
          backgroundColor: event.color || getEventColor(event),
          borderColor: event.color || getEventColor(event),
          extendedProps: {
            description: event.description,
            location: event.location,
            meeting_link: event.meeting_link,
            categories: event.event_category_tags || [],
            // Extrair roles do event_tags.roles
            roles: (event.event_tags || []).map(et => et.roles).filter(Boolean),
            created_by: event.created_by
          }
        };
      });
      
      // Store all events
      setAllEvents(transformedEvents);
      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error loading calendar data:', err);
      setError('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (event) => {
    // Return color from first category or default
    if (event.event_category_tags && event.event_category_tags.length > 0) {
      return event.event_category_tags[0].event_categories?.color || '#6b7280';
    }
    return '#6b7280';
  };

  // Event handlers
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      color: event.backgroundColor,
      ...event.extendedProps
    });
    setShowEventModal(true);
  };

  const handleDateClick = (arg) => {
    if (isAdmin() || hasPermission('manage_events')) {
      setEventForm({
        title: '',
        description: '',
        start_date: arg.dateStr,
        end_date: arg.dateStr,
        all_day: arg.allDay,
        location: '',
        meeting_link: '',
        color: '',
        categories: [],
        roles: [],
        users: []
      });
      setIsEditMode(false);
      setShowCreateEditModal(true);
    }
  };

  const handleEventDrop = async (info) => {
    if (!isAdmin() && !hasPermission('manage_events')) {
      info.revert();
      return;
    }

    try {
      await api.events.update(info.event.id, {
        start_date: info.event.start.toISOString(),
        end_date: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString(),
        all_day: info.event.allDay
      });
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Erro ao mover evento');
      info.revert();
    }
  };

  const handleEventResize = async (info) => {
    if (!isAdmin() && !hasPermission('manage_events')) {
      info.revert();
      return;
    }

    try {
      await api.events.update(info.event.id, {
        end_date: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
      });
    } catch (err) {
      console.error('Error resizing event:', err);
      alert('Erro ao redimensionar evento');
      info.revert();
    }
  };

  const handleEditEvent = () => {
    console.log('Editing event:', selectedEvent); // Debug
    setEventForm({
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      start_date: selectedEvent.start,
      end_date: selectedEvent.end || selectedEvent.start,
      all_day: selectedEvent.allDay || false,
      location: selectedEvent.location || '',
      meeting_link: selectedEvent.meeting_link || '',
      color: selectedEvent.color || '',
      categories: Array.isArray(selectedEvent.categories) 
        ? selectedEvent.categories.map(c => c.category_id || c.event_categories?.id).filter(Boolean)
        : [],
      roles: Array.isArray(selectedEvent.roles) 
        ? selectedEvent.roles.map(r => r.id || r.role_id).filter(Boolean)
        : []
    });
    setIsEditMode(true);
    setShowEventModal(false);
    setShowCreateEditModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return;

    try {
      await api.events.delete(selectedEvent.id);
      setShowEventModal(false);
      loadData();
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Erro ao deletar evento');
    }
  };

  const handleSaveEvent = async (formData) => {
    if (!formData.title.trim()) {
      alert('Título é obrigatório');
      return;
    }

    try {
      // 🔥 FIX: Enviar apenas campos básicos como AdminEventCreate (que funciona!)
      // Categories e roles são enviados separadamente para evitar bug do Supabase
      const basicEventData = {
        title: formData.title,
        description: formData.description || '',
        location: formData.location || null,
        meeting_link: formData.meeting_link || null,
        color: formData.color || null,
        all_day: formData.all_day || false,
        start_date: formData.start_date,  // Não converter para ISO - deixar backend fazer
        end_date: formData.end_date || null,
        status: formData.status || 'published'
      };

      console.log('Saving event with basic data:', basicEventData);

      if (isEditMode) {
        // UPDATE envia categories e roles juntos (funciona)
        const eventData = {
          ...basicEventData,
          categories: formData.categories || [],
          roles: formData.roles || []
        };
        await api.events.update(selectedEvent.id, eventData);
      } else {
        // CREATE envia SÓ dados básicos (igual AdminEventCreate que funciona)
        const eventData = {
          ...basicEventData,
          categories: formData.categories || [],
          roles: formData.roles || []
        };
        await api.events.create(eventData);
      }

      setShowCreateEditModal(false);
      
      // 🔄 Recarregar dados com cache busting
      await loadData();
      
    } catch (err) {
      console.error('Error saving event:', err);
      alert(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} evento: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-gray-300">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-700 dark:text-gray-200 mb-4">
            Calendário de Eventos
          </h1>
          <p className="text-secondary-600 dark:text-gray-300 max-w-2xl mx-auto">
            Confira nossos eventos e participe conosco!
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-md border border-beige-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-3">Filtrar por Categoria:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'shadow-md scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? category.color : category.color + '40',
                      color: isSelected ? '#ffffff' : category.color,
                      border: `2px solid ${category.color}`
                    }}
                  >
                    {category.name}
                  </button>
                );
              })}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* FullCalendar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-lg border border-beige-200 dark:border-gray-700 fullcalendar-container">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={window.innerWidth < 768 ? 'listWeek' : 'dayGridMonth'}
            locale={ptBrLocale}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: window.innerWidth < 768 ? 'dayGridMonth,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              list: 'Lista'
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            editable={isAdmin() || hasPermission('manage_events')}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            selectable={isAdmin() || hasPermission('manage_events')}
            selectMirror={true}
            dayMaxEvents={window.innerWidth < 768 ? 2 : true}
            weekends={true}
            height="auto"
            contentHeight="auto"
            aspectRatio={window.innerWidth < 768 ? 1.0 : 1.8}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
          />
        </div>

        {/* Event Detail Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto" onClick={() => setShowEventModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full my-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary-700 dark:text-gray-200 pr-8">
                    {selectedEvent.title}
                  </h2>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  {/* Date/Time */}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-secondary-700 dark:text-gray-200 font-medium">
                        {new Date(selectedEvent.start).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {!selectedEvent.allDay && (
                        <p className="text-secondary-600 dark:text-gray-400 text-sm">
                          {new Date(selectedEvent.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          {selectedEvent.end && ` - ${new Date(selectedEvent.end).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {selectedEvent.location && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-secondary-700 dark:text-gray-200">{selectedEvent.location}</p>
                    </div>
                  )}

                  {/* Meeting Link */}
                  {selectedEvent.meeting_link && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a
                        href={selectedEvent.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        Link da Reunião
                      </a>
                    </div>
                  )}

                  {/* Categories */}
                  {selectedEvent.categories && selectedEvent.categories.length > 0 && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.categories.map(cat => (
                          <span
                            key={cat.category_id}
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: cat.event_categories?.color || '#6b7280' }}
                          >
                            {cat.event_categories?.name || 'Categoria'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedEvent.description && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-secondary-700 dark:text-gray-200 mb-2">Descrição:</h3>
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert text-secondary-600 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                {(isAdmin() || hasPermission('manage_events')) && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleEditEvent}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDeleteEvent}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base"
                    >
                      Deletar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Event Modal */}
        <EventModal
          show={showCreateEditModal}
          isEditMode={isEditMode}
          eventForm={eventForm}
          setEventForm={setEventForm}
          categories={categories}
          roles={roles}
          users={users}
          onSave={handleSaveEvent}
          onClose={() => setShowCreateEditModal(false)}
          onCategoryCreated={loadData}
        />
      </div>
    </div>
  );
};

export default Calendar;
