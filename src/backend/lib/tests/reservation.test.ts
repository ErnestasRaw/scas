import { POST } from "@/app/api/reservations/route"; // Adjust path as necessary
import { NextResponse } from "next/server";
import Reservations from "@/models/Reservations";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { DELETE } from "@/app/api/admin/reservations/[reservationId]/route";

jest.mock("@/models/Reservations");
jest.mock("@/models/User");

jest.setTimeout(30000);

describe("POST /api/reservations", () => {
  it("should return 400 status code when body is empty", async () => {
    const req = {
      json: jest.fn().mockResolvedValue(null), 
    } as any;

    const response = await POST(req);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json).toEqual({ message: "Nenurodyti rezervacijos duomenys" });
  });

  it("should return 200 status code when body contains reservation data", async () => {
    const reservationData = {
      venueId: new ObjectId("5f5f5f5f5f5f5f5f5f5f5f5f"),
      date: "2023-10-10",
      time: "18:00",
      status: "confirmed",
      userId: new ObjectId("5f5f5f5f5f5f5f5f5f5f5f5f"),
    };

    const req = {
      json: jest.fn().mockResolvedValue(reservationData),
    } as any;

    const mockSave = jest.fn().mockResolvedValue({
      _id: new ObjectId("5f5f5f5f5f5f5f5f5f5f5f5f"),
      venueId: reservationData.venueId,
      reservationDate: new Date("2023-10-10T18:00:00Z"),
      status: reservationData.status,
      userId: reservationData.userId,
    });
    (Reservations as any).mockImplementation(() => ({
      save: mockSave,
    }));

    const mockUserSave = jest.fn();
    (User.findById as jest.Mock).mockResolvedValue({
      _id: reservationData.userId,
      orderHistory: [],
      save: mockUserSave,
    });

    const response = await POST(req);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
  });
});

describe("DELETE /api/reservations/:id", () => {
  it("should delete reservation and update user data, returning 200", async () => {
    const reservationId = "5f5f5f5f5f5f5f5f5f5f5f5f";
    const userId = "5f5f5f5f5f5f5f5f5f5f5f5f";
    
    const mockReservation = {
      _id: new ObjectId(reservationId),
      userId: new ObjectId(userId),
    };

    const mockUser = {
      _id: new ObjectId(userId),
      reservations: [reservationId],
      orderHistory: [reservationId],
    };

    const req = {} as any;
    const params = { reservationId }; 

    (Reservations.findById as jest.Mock).mockResolvedValue(mockReservation);
    (Reservations.findByIdAndDelete as jest.Mock).mockResolvedValue(mockReservation);
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const response = await DELETE(req, { params });

    expect(response.status).toBe(200);
    });
});

  describe("DELETE /api/reservations/:id", () => {
  it("should return 404 if reservation is not found", async () => {
    const reservationId = "5f5f5f5f5f5f5f5f5f5f5f5f";
    const req = {} as any;
    const params = { reservationId };

    (Reservations.findById as jest.Mock).mockResolvedValue(null);

    const response = await DELETE(req, { params });

    expect(response.status).toBe(404);
    const text = await response.text();
  });
});