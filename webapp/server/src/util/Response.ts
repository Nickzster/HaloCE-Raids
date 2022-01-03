import express from "express";

export interface IError {
  tag: string;
  message: string;
}

export interface IResponse {
  http: number;
  success?: {
    human: string;
  };
  failure?: {
    error: IError[];
  };
  data?: any;
}

class Response {
  private response: IResponse;
  public constructor() {
    this.response = {
      http: 200,
    };
    return this;
  }

  public buildAndSend(res: express.Response) {
    res.status(this.response.http).json(this.response);
  }

  public build() {
    return this.response;
  }

  public addHttp(http: number) {
    this.response.http = http;
    return this;
  }

  public addHumanMessage(human: string) {
    if (!this.response.success) {
      this.response.success = {
        human,
      };
      return this;
    }
    this.response.success.human = human;
    return this;
  }

  public addData(data: any) {
    this.response.data = data;
    return this;
  }

  public addLogMessage(log: string) {
    console.log(log);
    return this;
  }

  public addError(error: IError) {
    if (!this.response.failure) this.response.failure = { error: [] };
    this.response.failure.error.push(error);
    return this;
  }
}

export default Response;
