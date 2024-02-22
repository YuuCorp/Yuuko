import { Elysia } from "elysia";
import {config} from "../config"

export const ctx = new Elysia({
  name: '@app/ctx'
}).state('config', config)