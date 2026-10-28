
const STORAGE_KEY = "builderbroget_recent_activity";
const MAX_RECENT_ITEMS = 10;

export const getRecentActivity = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) : [];

    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Unable to read recent activity:", error);
    return [];
  }
};

export const recordRecentActivity = (item) => {
  if (!item?._id || !["property", "project"].includes(item.type)) {
    return;
  }

  try {
    const existing = getRecentActivity();

    const entry = {
      id: String(item._id),
      type: item.type,
      title:
        item.title ||
        item.name ||
        "Property or project",
      location: [item.location, item.city]
        .filter(Boolean)
        .join(", "),
      image:
        item.images?.[0] ||
        item.image ||
        item.imageUrl ||
        "",
      price:
        item.price ??
        item.minPrice ??
        null,
      viewedAt: new Date().toISOString(),
    };

    const updated = [
      entry,
      ...existing.filter(
        (activity) =>
          !(activity.id === entry.id && activity.type === entry.type)
      ),
    ].slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Unable to save recent activity:", error);
  }
};

export const clearRecentActivity = () => {
  localStorage.removeItem(STORAGE_KEY);
};
