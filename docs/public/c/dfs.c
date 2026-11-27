#include <stdio.h>
#define MAX_VERTICES 10
int graph[MAX_VERTICES][MAX_VERTICES];
int visited[MAX_VERTICES];
int V;
void dfs(int vertex) {
   visited[vertex] = 1;
   printf("%d ", vertex);
   for (int i = 0; i < V; i++) {
      if (graph[vertex][i] == 1 && !visited[i]) {
         dfs(i);
      }
   }
}
int main() {
   printf("Enter the number of vertices: ");
   scanf("%d", &V);
    printf("Enter the adjacency matrix (0 for no edge, 1 for edge):\n");
    for (int i = 0; i < V; i++) {
       for (int j = 0; j < V; j++) {
          scanf("%d", &graph[i][j]);
       }
    }
    for (int i = 0; i < V; i++) {
       visited[i] = 0;
    }
    printf("DFS Traversal starting from vertex 0: ");
    dfs(0);
    return 0;
}
