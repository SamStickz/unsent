import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gttlniitoayujaipfupr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dGxuaWl0b2F5dWphaXBmdXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjE5NDcsImV4cCI6MjA4NTA5Nzk0N30.hsK-P52d-KXvqx3s4r21I4wgwcPDHmeM65yjFeD9P0g",
);
