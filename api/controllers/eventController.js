import EventService from "../services/eventService.js";

class EventController {
  static async createEvents(req, res) {
    try {
      const events = await EventService.createEvents(req.body);
      res.status(201).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default EventController;
