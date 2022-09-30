/**
 * Copied what was needed from as-wasi:
 * https://github.com/jedisct1/as-wasi/blob/master/assembly/as-wasi.ts
 * 
 * Could not use directly due to this issue:
 * https://github.com/jedisct1/as-wasi/issues/127
 */
 
import {
    advice,
    args_get,
    args_sizes_get,
    clock_res_get,
    clock_time_get,
    clockid,
    subscription_clock,
    dircookie,
    environ_get,
    environ_sizes_get,
    errno,
    event,
    eventtype,
    fd_advise,
    fd_allocate,
    fd_close,
    fd_datasync,
    fd_fdstat_get,
    fd_fdstat_set_flags,
    fd_filestat_get,
    fd_filestat_set_size,
    fd_filestat_set_times,
    fd_prestat_dir_name,
    fd_read,
    fd_readdir,
    fd_seek,
    fd_sync,
    fd_tell,
    fd_write,
    fd,
    fdflags,
    fdstat,
    whence,
    filesize,
    filestat,
    filetype,
    fstflags,
    lookupflags,
    oflags,
    path_create_directory,
    path_filestat_get,
    path_link,
    path_open,
    path_rename,
    path_remove_directory,
    path_symlink,
    path_unlink_file,
    poll_oneoff,
    proc_exit,
    random_get,
    rights,
  } from "@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1";

type aisize = i32;

/**
 * A WASI error
 */
 export class WASIError extends Error {
    constructor(message: string = "") {
      super(message);
      this.name = "WASIError";
    }
  }

export class Console {
    /**
     * Write a string to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    static write(s: string, newline: bool = true): void {
      Descriptor.Stdout.writeString(s, newline);
    }
  
    /**
     * Read as much data as possible from the console, convert it to a native string
     */
    static readAll(): string | null {
      return Descriptor.Stdin.readString();
    }
  
    /**
     * Read a line of text from the console, convert it from UTF8 to a native string
     */
    static readLine(): string | null {
      return Descriptor.Stdin.readLine();
    }
  
    /**
     * Alias for `Console.write()`
     */
    static log(s: string): void {
      this.write(s);
    }
  
    /**
     * Write an error to the console
     * @param s string
     * @param newline `false` to avoid inserting a newline after the string
     */
    static error(s: string, newline: bool = true): void {
      Descriptor.Stderr.writeString(s, newline);
    }
  }

@final @unmanaged
export class Descriptor {
  /**
   * An invalid file descriptor, that can represent an error
   */
  @inline static get Invalid(): Descriptor { return new Descriptor(-1); };

  /**
   * The standard input
   */
  @inline static get Stdin(): Descriptor { return new Descriptor(0); };

  /**
   * The standard output
   */
  @inline static get Stdout(): Descriptor { return new Descriptor(1); };

  /**
   * The standard error
   */
  @inline static get Stderr(): Descriptor { return new Descriptor(2); };

  /**
   * Build a new descriptor from a raw WASI file descriptor
   * @param rawfd a raw file descriptor
   */
  constructor(rawfd: fd) {
    return changetype<Descriptor>(rawfd);
  }

  @inline get rawfd(): fd {
    return changetype<fd>(this);
  }

  /**
   * Hint at how the data accessible via the descriptor will be used
   * @offset offset
   * @len length
   * @advice `advice.{NORMAL, SEQUENTIAL, RANDOM, WILLNEED, DONTNEED, NOREUSE}`
   * @returns `true` on success, `false` on error
   */
  advise(offset: u64, len: u64, advice: advice): bool {
    return fd_advise(this.rawfd, offset, len, advice) === errno.SUCCESS;
  }

  /**
   * Preallocate data
   * @param offset where to start preallocating data in the file
   * @param len bytes to preallocate
   * @returns `true` on success, `false` on error
   */
  allocate(offset: u64, len: u64): bool {
    return fd_allocate(this.rawfd, offset, len) === errno.SUCCESS;
  }

  /**
   * Wait for the data to be written
   * @returns `true` on success, `false` on error
   */
  fdatasync(): bool {
    return fd_datasync(this.rawfd) === errno.SUCCESS;
  }

  /**
   * Wait for the data and metadata to be written
   * @returns `true` on success, `false` on error
   */
  fsync(): bool {
    return fd_sync(this.rawfd) === errno.SUCCESS;
  }

  /**
   * Return the file type
   */
  fileType(): filetype {
    // @ts-ignore
    let st_buf = memory.data(24);
    if (fd_fdstat_get(this.rawfd, changetype<fdstat>(st_buf)) !== errno.SUCCESS) {
      throw new WASIError("Unable to get the file type");
    }
    return load<u8>(st_buf);
  }

  /**
   * Set WASI flags for that descriptor
   * @params flags: one or more of `fdflags.{APPEND, DSYNC, NONBLOCK, RSYNC, SYNC}`
   * @returns `true` on success, `false` on error
   */
  setFlags(flags: fdflags): bool {
    return fd_fdstat_set_flags(this.rawfd, flags) === errno.SUCCESS;
  }

  /**
   * Retrieve information about a descriptor
   * @returns a `FileStat` object`
   */
  stat(): FileStat {
    let st_buf = changetype<usize>(new ArrayBuffer(56));
    if (fd_filestat_get(this.rawfd, changetype<filestat>(st_buf)) !== errno.SUCCESS) {
      throw new WASIError("Unable to get the file information");
    }
    return new FileStat(st_buf);
  }

  /**
   * Change the size of a file
   * @param size new size
   * @returns `true` on success, `false` on error
   */
  ftruncate(size: u64 = 0): bool {
    return fd_filestat_set_size(this.rawfd, size) === errno.SUCCESS;
  }

  /**
   * Update the access time
   * @ts timestamp in seconds
   * @returns `true` on success, `false` on error
   */
  fatime(ts: f64): bool {
    return (
      fd_filestat_set_times(this.rawfd, (ts * 1e9) as u64, 0, fstflags.SET_ATIM) ===
      errno.SUCCESS
    );
  }

  /**
   * Update the modification time
   * @ts timestamp in seconds
   * @returns `true` on success, `false` on error
   */
  fmtime(ts: f64): bool {
    return (
      fd_filestat_set_times(this.rawfd, 0, (ts * 1e9) as u64, fstflags.SET_MTIM) ===
      errno.SUCCESS
    );
  }

  /**
   * Update both the access and the modification times
   * @atime timestamp in seconds
   * @mtime timestamp in seconds
   * @returns `true` on success, `false` on error
   */
  futimes(atime: f64, mtime: f64): bool {
    return (
      fd_filestat_set_times(
        this.rawfd,
        (atime * 1e9) as u64,
        (mtime * 1e9) as u64,
        fstflags.SET_ATIM | fstflags.SET_ATIM
      ) === errno.SUCCESS
    );
  }

  /**
   * Update the timestamp of the object represented by the descriptor
   * @returns `true` on success, `false` on error
   */
  touch(): bool {
    return (
      fd_filestat_set_times(
        this.rawfd,
        0,
        0,
        fstflags.SET_ATIM_NOW | fstflags.SET_MTIM_NOW
      ) === errno.SUCCESS
    );
  }

  /**
   * Return the directory associated to that descriptor
   */
  dirName(): string {
    let path_max = 4096 as usize;
    // @ts-ignore
    let path_buf = heap.alloc(path_max);
    while (true) {
      let ret = fd_prestat_dir_name(this.rawfd, path_buf, path_max);
      if (ret === errno.NAMETOOLONG) {
        path_max *= 2;
        // @ts-ignore
        path_buf = heap.realloc(path_buf, path_max);
        continue;
      }
      let path = String.UTF8.decodeUnsafe(path_buf, path_max, true);
      // @ts-ignore
      heap.free(path_buf);
      return path;
    }
  }

  /**
   * Close a file descriptor
   */
  close(): void {
    fd_close(this.rawfd);
  }

  /**
   * Write data to a file descriptor
   * @param data data
   */
  write(data: u8[]): void {
    let data_buf_len = data.length;
    let data_buf_out = changetype<usize>(new ArrayBuffer(data_buf_len));
    // @ts-ignore: cast
    let data_buf_in = changetype<ArrayBufferView>(data).dataStart;
    memory.copy(data_buf_out, data_buf_in, data_buf_len);
    let iov = memory.data(16);
    store<u32>(iov, data_buf_out, 0);
    store<u32>(iov, data_buf_len, sizeof<usize>());
    let written_ptr = memory.data(8);
    fd_write(this.rawfd, iov, 1, written_ptr);
  }

  /**
     * Write a string to a file descriptor, after encoding it to UTF8
     * @param s string
     * @param newline `true` to add a newline after the string
     */
  writeString(s: string, newline: bool = false): void {
    if (newline) {
      this.writeStringLn(s);
      return;
    }
    let s_utf8_buf = String.UTF8.encode(s);
    let s_utf8_len: usize = s_utf8_buf.byteLength;
    let iov = memory.data(16);
    store<u32>(iov, changetype<usize>(s_utf8_buf));
    store<u32>(iov, s_utf8_len, sizeof<usize>());

    let written_ptr = memory.data(8);
    fd_write(this.rawfd, iov, 1, written_ptr);
  }

  /**
   * Write a string to a file descriptor, after encoding it to UTF8, with a newline
   * @param s string
   */
  writeStringLn(s: string): void {
    let s_utf8_buf = String.UTF8.encode(s);
    let s_utf8_len: usize = s_utf8_buf.byteLength;
    let iov = memory.data(32);
    store<u32>(iov, changetype<usize>(s_utf8_buf));
    store<u32>(iov, s_utf8_len, sizeof<usize>());
    let lf = memory.data(8);
    store<u8>(lf, 10);
    store<u32>(iov, lf, sizeof<usize>() * 2);
    store<u32>(iov, 1, sizeof<usize>() * 3);

    let written_ptr = memory.data(8);
    fd_write(this.rawfd, iov, 2, written_ptr);
  }

  /**
   * Read data from a file descriptor
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  read(
    data: u8[] = [],
    chunk_size: usize = 4096
  ): u8[] | null {
    let data_partial_len = chunk_size;
    let data_partial = changetype<usize>(new ArrayBuffer(data_partial_len as aisize));
    let iov = memory.data(16);
    store<u32>(iov, data_partial, 0);
    store<u32>(iov, data_partial_len, sizeof<usize>());
    let read_ptr = memory.data(8);
    if (fd_read(this.rawfd, iov, 1, read_ptr) !== errno.SUCCESS) {
      return null;
    }
    let read = load<usize>(read_ptr);
    if (read > 0) {
      for (let i: usize = 0; i < read; i++) {
        data.push(load<u8>(data_partial + i));
      }
    }
    if (read < 0) {
      return null;
    }
    return data;
  }

  /**
   * Read from a file descriptor until the end of the stream
   * @param data existing array to push data to
   * @param chunk_size chunk size (default: 4096)
   */
  readAll(
    data: u8[] = [],
    chunk_size: usize = 4096
  ): u8[] | null {
    let data_partial_len = chunk_size;
    let data_partial = changetype<usize>(new ArrayBuffer(data_partial_len as aisize));
    let iov = memory.data(16);
    store<u32>(iov, data_partial, 0);
    store<u32>(iov, data_partial_len, sizeof<usize>());
    let read_ptr = memory.data(8);
    let read: usize = 0;
    let rawfd = this.rawfd;
    while (true) {
      if (fd_read(rawfd, iov, 1, read_ptr) !== errno.SUCCESS) {
        return null;
      }
      read = load<usize>(read_ptr);
      if (read <= 0) {
        break;
      }
      for (let i: usize = 0; i < read; i++) {
        data.push(load<u8>(data_partial + i));
      }
    }
    if (read < 0) {
      return null;
    }
    return data;
  }

  /**
   * Read a line of text from a file descriptor
   */
  readLine(): string | null {
    let byte = memory.data(1);
    let iov = memory.data(16);
    store<u32>(iov, byte, 0);
    store<u32>(iov, 1, sizeof<usize>());
    let read_ptr = memory.data(8);
    let read: usize = 0;
    let rawfd = this.rawfd;
    let cr_seen = false;
    let line = new Array<u8>();
    while (true) {
      if (fd_read(rawfd, iov, 1, read_ptr) !== errno.SUCCESS) {
        return null;
      }
      read = load<usize>(read_ptr);
      if (read <= 0) {
        return null;
      }
      let c = load<u8>(byte);
      if (c == 10) {
        break;
      } else if (c == 13 && !cr_seen) {
        cr_seen = true;
      } else if (cr_seen) {
        return null;
      } else {
        line.push(c);
      }
    }
    // @ts-ignore: cast
    return String.UTF8.decodeUnsafe(line.dataStart, line.length);
  }

  /**
   * Read as much data as possible from a file descriptor, convert it to a native string
   * @param chunk_size chunk size (default: 4096)
   */
  readString(chunk_size: usize = 4096): string | null {
    let s_utf8 = this.readAll();
    if (s_utf8 === null) {
      return null;
    }
    // @ts-ignore: cast
    return String.UTF8.decodeUnsafe(s_utf8.dataStart, s_utf8.length);
  }

  /**
   * Seek into a stream
   * @off offset
   * @w the position relative to which to set the offset of the file descriptor.
   */
  seek(off: u64, w: whence): bool {
    let fodder = memory.data(8);
    let res = fd_seek(this.rawfd, off, w, fodder);

    return res === errno.SUCCESS;
  }

  /**
   * Return the current offset in the stream
   * @returns offset
   */
  tell(): u64 {
    let buf_off = memory.data(8);
    let res = fd_tell(this.rawfd, buf_off);
    if (res !== errno.SUCCESS) {
      abort();
    }
    return load<u64>(buf_off);
  }
}

/**
 * Portable information about a file
 */
 export class FileStat {
    file_type: filetype;
    file_size: filesize;
    access_time: f64;
    modification_time: f64;
    creation_time: f64;
  
    constructor(st_buf: usize) {
      this.file_type = load<u8>(st_buf, 16);
      this.file_size = load<u64>(st_buf, 24);
      this.access_time = (load<u64>(st_buf, 32) as f64) / 1e9;
      this.modification_time = (load<u64>(st_buf, 40) as f64) / 1e9;
      this.creation_time = (load<u64>(st_buf, 48) as f64) / 1e9;
    }
  }