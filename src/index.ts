function importAll(r: any) {
  r.keys().forEach(r);
}

importAll((require as any).context('./', true, /\.scss|ts$/));
