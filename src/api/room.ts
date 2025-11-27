import { api } from './client';
import type { RoomMetrics } from '../types/metrics';

export async function fetchCurrentRoomMetrics(): Promise<RoomMetrics> {
  const res = await api.get<RoomMetrics>('/room/current');
  return res.data;
}
