"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import EmptyTestimonial from "@/components/empty-testimonial";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Testimonial {
  id: number;
  name: string;
  shop: string;
  message: string;
  rating: number;
}

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [shop, setShop] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setTestimonials((prev) => [
      { id: Date.now(), name, shop, message, rating },
      ...prev,
    ]);
    setName("");
    setShop("");
    setMessage("");
    setRating(5);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      {testimonials.length > 0 && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Wall of Love 💖</h2>
            <p className="text-sm text-muted-foreground">
              {testimonials.length} merchant{testimonials.length !== 1 ? "s" : ""} sharing their experience
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-muted-foreground/30 bg-background hover:border-primary hover:bg-primary/5 transition-all duration-300 text-sm font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <HugeiconsIcon icon={Add01Icon} size={12} strokeWidth={3} />
            </div>
            Add Testimonial
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-base font-semibold">Share your experience with DukaBot</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Your name *</label>
                      <input
                        className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="e.g. John Kamau"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Shop / Business</label>
                      <input
                        className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="e.g. Luthuli Electronics"
                        value={shop}
                        onChange={(e) => setShop(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Your experience *</label>
                    <textarea
                      className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      rows={3}
                      placeholder="Tell us how DukaBot has helped your business..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-xl transition-transform hover:scale-110 ${
                            star <= rating ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {testimonials.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyTestimonial onAdd={() => setShowForm(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="text-sm">⭐</span>
                        ))}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">"{t.message}"</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium leading-none">{t.name}</p>
                          {t.shop && (
                            <p className="text-xs text-muted-foreground mt-0.5">{t.shop}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
