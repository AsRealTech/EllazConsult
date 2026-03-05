import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";

export function Blog() {
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="bg-secondary/20 min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">CAC News & Updates</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stay informed with the latest regulations, compliance requirements, and business tips for Nigerian companies.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-6 h-72 border border-border shadow-sm animate-pulse"></div>
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-2 font-display">No posts yet</h3>
            <p className="text-muted-foreground">Check back later for updates and news.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="bg-card h-full rounded-3xl p-6 sm:p-8 border border-border/60 shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col group cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-4 bg-primary/10 w-fit px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    {post.publishedAt ? format(new Date(post.publishedAt), 'MMM dd, yyyy') : 'Recent'}
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {post.content.replace(/<[^>]*>?/gm, '')} {/* Basic strip HTML if it contains tags */}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                    Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
