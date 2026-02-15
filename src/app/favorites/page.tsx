"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowLeft, 
  Briefcase, 
  Star, 
  MapPin, 
  Plus,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface FavoritePlace {
  id: string;
  name: string;
  address: string;
  type: "home" | "work" | "other";
}

const initialFavorites: FavoritePlace[] = [
  {
    id: "1",
    name: "Home",
    address: "B-42, Vasant Kunj, New Delhi",
    type: "home",
  },
  {
    id: "2",
    name: "Work",
    address: "Tower A, Cyber City, Gurugram",
    type: "work",
  },
  {
    id: "3",
    name: "Gym",
    address: "Gold's Gym, Hauz Khas, Delhi",
    type: "other",
  },
  {
    id: "4",
    name: "Parents Home",
    address: "Sector 15, Noida, UP",
    type: "other",
  },
];

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoritePlace[]>(initialFavorites);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: "", address: "" });

  const getIcon = (type: string, name: string) => {
    // Check for gym by name
    if (name.toLowerCase().includes("gym")) {
      return (
        <Image
          src="/assets/gym.svg"
          alt="Gym"
          width={24}
          height={24}
          className="object-contain"
        />
      );
    }
    switch (type) {
      case "home":
        return (
          <Image
            src="/assets/home.svg"
            alt="Home"
            width={24}
            height={24}
            className="object-contain"
          />
        );
      case "work":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const handleDelete = (id: string) => {
    setFavorites(favorites.filter((f) => f.id !== id));
    setShowMenu(null);
    toast.success("Location removed from favorites");
  };

  const handleAddPlace = () => {
    if (!newPlace.name || !newPlace.address) {
      toast.error("Please fill in all fields");
      return;
    }
    const newFavorite: FavoritePlace = {
      id: Date.now().toString(),
      name: newPlace.name,
      address: newPlace.address,
      type: "other",
    };
    setFavorites([...favorites, newFavorite]);
    setNewPlace({ name: "", address: "" });
    setShowAddModal(false);
    toast.success("Location added to favorites");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 sm:p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Favorite Places</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No favorite places yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your frequently visited places for quick access
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Add Place
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((place) => (
              <div
                key={place.id}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors relative"
                onClick={() => {
                  toast.success(`Selected: ${place.name}`);
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    place.type === "home"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                      : place.type === "work"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                  }`}
                >
                  {getIcon(place.type, place.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{place.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {place.address}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(showMenu === place.id ? null : place.id);
                  }}
                  className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {showMenu === place.id && (
                  <div className="absolute right-4 top-16 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info("Edit feature coming soon");
                        setShowMenu(null);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(place.id);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Add Favorite Place</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Place Name
                </label>
                <input
                  type="text"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  placeholder="e.g., Gym, Coffee Shop"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Address
                </label>
                <input
                  type="text"
                  value={newPlace.address}
                  onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                  placeholder="Enter full address"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setNewPlace({ name: "", address: "" });
                  setShowAddModal(false);
                }}
                className="flex-1 h-12 rounded-xl border border-border font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlace}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Add Place
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}
