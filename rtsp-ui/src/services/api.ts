import axios from 'axios';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Camera {
  name: string;
  rtspUrl: string;
  rtmpUrl: string;
  ready: boolean;
  runOnReady?: string;
  runOnReadyRestart?: boolean;
  source?: string;
  publishUser?: string;
  publishPass?: string;
}

export interface CameraFormData {
  name: string;
  rtspUrl: string;
  rtmpUrl: string;
}

export interface StreamSettings {
  resolution: string;
  bitrate: string;
  framerate: string;
  quality: string;
  preset: string;
}

export interface StreamProcessing {
  name: string;
  source: string;
  ready: boolean;
  ffmpegProcess: {
    command: string;
    status: string;
    restartPolicy: string;
  };
  rtmpOutput: {
    url: string | null;
    status: string;
    target: string | null;
  };
  transferStatus: {
    inputConnected: boolean;
    outputConnected: boolean;
    processingActive: boolean;
  };
}

export interface Status {
  active: Array<{
    name: string;
    bytesReceived: number;
    tracks: string[];
  }>;
  sessions: unknown[];
  total: {
    active: number;
    sessions: number;
    sent: number;
    received: number;
  };
  raw: {
    itemCount: number;
    pageCount: number;
    items: unknown[];
  };
  paths: unknown[];
  rtsps: unknown[];
  rtmps: unknown[];
  streamProcessing: {
    ffmpegProcesses: unknown[];
    rtmpOutputs: unknown[];
    transferStats: {
      totalInputs: number;
      activeInputs: number;
      totalOutputs: number;
      activeOutputs: number;
      externalRtmpStreams: number;
      processingEfficiency: string;
    };
  };
  summary: {
    totalPaths: number;
    activeStreams: number;
    totalRTSPSessions: number;
    totalRTMPSessions: number;
    ffmpegProcesses: number;
    rtmpOutputs: number;
    externalRtmpStreams: number;
  };
}

export interface StreamIOData {
  name: string;
  source: string;
  ready: boolean;
  lastActivity: string;
  input: {
    connected: boolean;
    protocol: string;
    url: string;
    sessions: number;
    bytesReceived: number;
    bitrate: number;
  };
  output: {
    connected: boolean;
    protocol: string;
    url: string | null;
    sessions: number;
    bytesSent: number;
    bitrate: number;
  };
  ffmpeg: {
    command: string;
    status: string;
    restartPolicy: string;
  };
  metrics: {
    bytesReceived: number;
    bytesSent: number;
    totalBytes: number;
    inputBitrate: number;
    outputBitrate: number;
    efficiency: string;
  };
  rtspSessions: unknown[];
  rtmpSessions: unknown[];
}

export interface ContainerLogs {
  container: string;
  logs: {
    timestamp: string;
    message: string;
    level: string;
  }[];
}

const api = {
  // Camera endpoints
  getCameras: async (): Promise<Camera[]> => {
    const response = await axios.get(`${API_URL}/cameras`);
    return response.data;
  },

  addCamera: async (cameraData: { name: string; rtspUrl: string; rtmpUrl: string }): Promise<Camera> => {
    const response = await axios.post(`${API_URL}/cameras`, cameraData);
    return response.data;
  },

  deleteCamera: async (cameraName: string): Promise<void> => {
    await axios.delete(`${API_URL}/cameras/${cameraName}`);
  },

  // Stream settings endpoints
  getStreamSettings: async (cameraName: string): Promise<StreamSettings> => {
    const response = await axios.get(`${API_URL}/cameras/${cameraName}/stream-settings`);
    return response.data;
  },

  updateStreamSettings: async (cameraName: string, settings: StreamSettings): Promise<{ success: boolean; message: string; updatedCommand: string }> => {
    const response = await axios.put(`${API_URL}/cameras/${cameraName}/stream-settings`, settings);
    return response.data;
  },

  // Status endpoint
  getStatus: async (): Promise<Status> => {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  },

  // Stream processing endpoint
  getStreamProcessing: async (streamName: string): Promise<StreamProcessing> => {
    const response = await axios.get(`${API_URL}/streams/${streamName}/processing`);
    return response.data;
  },
  
  // Stream I/O data endpoint
  getStreamIOData: async (streamName: string): Promise<StreamIOData> => {
    const response = await axios.get(`${API_URL}/streams/${streamName}/io`);
    return response.data;
  },
  
  // Docker logs endpoint
  getContainerLogs: async (containerName: string, lines: number = 100): Promise<ContainerLogs> => {
    const response = await axios.get(`${API_URL}/logs/${containerName}`, {
      params: { lines }
    });
    return response.data;
  }
};

export default api; 