find . \( -type d \( -name "node_modules" -o -name ".git" -o -name ".next" -o -name "dist" -o -name "build" \) -prune \) -o -print \
| awk '
  BEGIN {
    FS = "/"
    OFS = ""
  }
  FNR == 1 {
    print $0
    next
  }
  {
    depth = NF - 1
    name = $NF
    parent = substr($0, 1, length($0) - length(name) - 1)

    total_children[parent]++
    records[FNR] = $0
    names[FNR]   = name
    depths[FNR]  = depth
    parents[FNR] = parent
  }
  END {
    for (i = 2; i <= FNR; i++) {
      path   = records[i]
      name   = names[i]
      depth  = depths[i]
      parent = parents[i]

      seen[parent]++
      is_last = (seen[parent] == total_children[parent])

      indent = ""
      for (d = 1; d < depth; d++) {
        indent = indent (branch[d] ? "    " : "│   ")
      }

      printf "%s%s %s\n", indent, (is_last ? "└──" : "├──"), name

      branch[depth] = is_last
    }
  }
'