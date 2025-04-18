import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kqrcmqbjghumzjrznjfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcmNtcWJqZ2h1bXpqcnpuamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1Njc3NjEsImV4cCI6MjA2MDE0Mzc2MX0.306ujUWI_QOHvCd1Au0h10q3WW5ubHwFeUmPZUKlZhs';

export const supabase = createClient(supabaseUrl, supabaseKey);
