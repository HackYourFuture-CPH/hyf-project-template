import EventModel from "../models/eventModel.js";

class EventService {
  static async createEvents(data) {
    // const stringifiedData = JSON.stringify(data);
    try {
      const newEvent = await EventModel.create(data);
      console.log("newEvent" + newEvent);
      return newEvent;
    } catch (error) {
      throw new Error("Error creating event: " + error.message);
    }
  }
  //events
  static async getEventsByUserId(clientId) {
    try {
      const project = await EventModel.findAll({
        where: { id: clientId },
      });
      if (!project) {
        throw new Error("Events not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching projects: " + error.message);
    }
  }
}

export default EventService;
