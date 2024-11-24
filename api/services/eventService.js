import EventModel from "../models/eventModel.js";

class EventService {
  static async createEvents(data) {
    // const stringifiedData = JSON.stringify(data);
    try {
      if (!data.userId) {
        throw new Error("userId is required to create an event.");
      }
      const newEvent = await EventModel.create({
        ...data,
        userId: data.userId,
      });

      console.log("New Event Created:", newEvent.toJSON());
      return newEvent;
    } catch (error) {
      throw new Error("Error creating event: " + error.message);
    }
  }
  //events
  static async getEventsByUserId(userId) {
    try {
      const project = await EventModel.findAll({
        where: { userId: userId },
      });
      if (!project) {
        throw new Error("Events not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching events: " + error.message);
    }
  }
}

export default EventService;
